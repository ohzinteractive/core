# DevBridge

Lets a tool outside the browser, the ohzi-mcp server, see and drive the running app. `DevBridge` keeps a WebSocket open to the server on `127.0.0.1` and runs each command it receives through a handler the app registered. The other eleven classes are the building blocks for those handlers: each does one job, takes the singletons it reads (`SceneManager.current`, `Graphics`, `ViewManager`...) as arguments, and validates every argument, because commands arrive off the wire. Use it during development only. Nothing in core starts it, and the app should load it behind an `import.meta.env.DEV` guard so it stays out of production builds.

## Export

```ts
import { DevBridge } from './dev_bridge/DevBridge';
import { SceneInspector } from './dev_bridge/SceneInspector';
import { SceneEditor } from './dev_bridge/SceneEditor';
import { CameraBridge } from './dev_bridge/CameraBridge';
import { CaptureService } from './dev_bridge/CaptureService';
import { ConsoleBuffer } from './dev_bridge/ConsoleBuffer';
import { PerformanceProbe } from './dev_bridge/PerformanceProbe';
import { InputSynthesizer } from './dev_bridge/InputSynthesizer';
import { ViewNavigator } from './dev_bridge/ViewNavigator';
import { RenderModeRegistry } from './dev_bridge/RenderModeRegistry';
import { DebugDrawer } from './dev_bridge/DebugDrawer';
import { ModelLoader } from './dev_bridge/ModelLoader';
```

Not singletons — instantiated as needed. The interfaces they take and return (`CameraState`, `CaptureOptions`...) are not exported from the package index. Every error they throw is an `Error` with a `code` field, listed in each section, which reaches the server as `error.code`.

| Class | Use it for |
|-------|------------|
| `DevBridge` | The connection: handshake, command registry, timing, reconnects. |
| `SceneInspector` / `SceneEditor` | A bounded tree of the scene graph; reading and changing one node. |
| `CameraBridge` | Reading and moving the camera, through its `CameraController` when it has one. |
| `CaptureService` | A PNG of the canvas, base64 encoded. |
| `ConsoleBuffer` / `PerformanceProbe` | The latest console lines and uncaught errors; FPS, frame time and renderer counters. |
| `InputSynthesizer` | Clicks, drags, wheel and keys, sent as real DOM events. |
| `ViewNavigator` / `RenderModeRegistry` | Listing and entering views; listing and creating render modes by name. |
| `DebugDrawer` | Debug helpers that can be cleared later. |
| `ModelLoader` | Previewing a GLB in the scene, replacing an earlier one with the same name. |

## Command Flow

```
ohzi-mcp server                          browser
───────────────                          ───────
      ◄── connect ws://127.0.0.1:<port> ──  DevBridge.init()
      ◄── { event: 'hello', protocol, app: app_info() }
'welcome' / 'refused' ──►  console.info / console.warn
{ id, cmd, args } ──►  look up cmd
                         ├─ unknown ─────► reply unknown_command
                         ├─ 'immediate' ─► run handler(args) now
                         └─ 'frame_end' ─► queue
                                             │
           RenderLoop: render, Debug.render, app.on_frame_end()
                                             └─► bridge.on_frame_end() runs the queue
      ◄── { id, ok: true, result }  or  { id, ok: false, error: { code, message } }

socket closed ──► reconnect every 2 s until dispose()
```

---

## DevBridge

The constructor takes no parameters. Nothing connects until `init()`.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `dispatcher` | `CommandDispatcher` | Holds the handlers and the queued `frame_end` commands. Internal and not exported; use `register()` and `on_frame_end()`. |

### Methods

| Method | Description |
|--------|-------------|
| `init({ port, app_info })` | Connects to `ws://127.0.0.1:<port>`. On open, sends a `hello` with `PROTOCOL_VERSION` and `app_info()`, an `AppInfo` with `core_version`, `components_version`, `pit_version`, `active_view`, `has_camera` and `canvas` (`width`, `height`, `dpr`). |
| `register(cmd, timing, handler)` | Registers `handler(args)` for `cmd`, replacing any earlier one. `timing` is `'immediate'` or `'frame_end'`. The handler returns its result, or a promise of it. |
| `on_frame_end()` | Runs the queued `frame_end` commands. Call it from the application's `on_frame_end()`. |
| `dispose()` | Stops reconnecting and closes the socket. `init()` can connect again. |

- Register anything that changes what renders (transforms, camera, render mode, captures) as `frame_end`, so it never lands between `update()` and the render. Reads, and handlers that wait on real time like input, can be `immediate`.
- A handler that throws or rejects replies with its error's `code`, or `handler_failed` when it has none. Replies are dropped while the socket is not open, and frames without a string `id` and `cmd` are ignored.
- A closed socket, including a server that is not running yet, retries every 2 seconds, silently. `PROTOCOL_VERSION` in `dev_bridge/protocol.ts` must match `mcp/src/protocol.ts`; otherwise the server answers `refused` and the bridge logs a warning.

---

## SceneInspector & SceneEditor

Both take the scene root per call (usually `SceneManager.current`), so they follow view changes. Vectors come back rounded to 4 decimals.

| Method | Returns | Description |
|--------|---------|-------------|
| `SceneInspector.inspect(root, { depth?, max_nodes?, filter? })` | `SceneInspectionResult` | Serializes the tree under a budget: `depth` levels below the root (default 4) and at most `max_nodes` nodes (default 200). `filter` keeps the nodes whose name or type contains it, case insensitive, plus their ancestors. |
| `SceneEditor.get(root, { uuid?, name? })` | `NodeDetail` | The first node, depth first, matching `uuid` or, when no `uuid` is given, `name`. |
| `SceneEditor.set(root, selector, { position?, rotation?, scale?, visible? })` | `NodeDetail` | Applies the changes and returns the resulting state, with the fields it applied in `changed`. |

- `inspect()` returns `root` (a node tree, or `null` with a note when there is no scene), `counts` (`total`, `meshes`, `returned`), `truncated` and `notes`, which say what the budget dropped. A cut node carries a `truncated` string. A filter that matches nothing returns only the root, with a note.
- Each inspected node has `uuid`, `name`, `type` and `position`, plus `rotation` and `scale` only when not default, `visible: false` only when hidden, the material type and the vertex count. `counts.meshes` counts nodes whose `type` is exactly `'Mesh'`.
- A `NodeDetail` always has `rotation`, `scale` and `visible`, plus `parent` (its name, else its uuid, `null` for the root) and the child count.
- `set()` writes each array entry on its own: `rotation: [null, 1.57, null]` changes only `rotation.y` (Euler radians). Entries that are not finite numbers are skipped, never coerced.
- Errors: `not_found` (no scene, no selector, or no match).

---

## CameraBridge

`CameraController` rewrites the camera transform every update, so with a controller the bridge moves the controller instead of the camera. Pass `CameraManager.current` and the scene's `camera_controller`, or `null` when it has none.

| Method | Returns | Description |
|--------|---------|-------------|
| `get(camera, controller)` | `CameraState` | `position`, `fov`, `near`, `far`, `clear_color` (`'#rrggbb'`), `clear_alpha` (each `null` when the camera has none), and `controller`: `tilt`, `orientation`, `azimuth`, `zoom`, `min_zoom`, `max_zoom`, `target`, or `null`. |
| `set(camera, controller, changes)` | `CameraState` | Applies `changes` (below) and lists what it applied in `changed`. |
| `frame(camera, controller, root, { uuid?, name?, scale? }, make_bounds)` | `CameraState` | Finds the node under `root` and calls `controller.focus_on_bounding_box(make_bounds(node), scale)`. `scale` defaults to 1. Needs a controller. |

| Change | Effect |
|--------|--------|
| `tilt`, `orientation`, `azimuth` | Degrees, through `set_rotation()`. An omitted angle keeps its value. Controller only. |
| `zoom` | `set_normalized_zoom()`, clamped to 0–1. Controller only. |
| `target` | `[x, y, z]` written to `reference_position`. Controller only. |
| `position` | `[x, y, z]` written to `camera.position`. Without a controller only; with one it throws `controller_owns_camera`. |
| `fov` | Sets `camera.fov` and calls `updateProjectionMatrix()`. |

- Without a controller, the controller-only changes are ignored and left out of `changed`.
- With a controller, the orbit changes are applied before `position` is checked, so a request that also sends `position` changes the orbit, then throws, and skips `fov`.
- Errors: `no_camera`, `no_controller`, `not_found`, `controller_owns_camera`.

---

## CaptureService

`new CaptureService(graphics, has_camera, create_canvas?)`: `graphics` is usually `Graphics` (anything with a `canvas` and `take_screenshot(callback, width, height)`), `has_camera` is a predicate such as `() => CameraManager.current !== undefined`, and `create_canvas` makes the scratch canvas for downscaling (default `document.createElement('canvas')`).

| Method | Returns | Description |
|--------|---------|-------------|
| `capture({ mode?, max_size?, width?, height? })` | `Promise<CaptureResult>` | `mode`, `mime_type` (`'image/png'`), `width`, `height`, `bytes`, `data` (base64), and `scaled_from` when downscaled. |

- **Fast** (default, any `mode` but `'hires'`): reads the canvas as it is, which relies on the renderer being created with `preserveDrawingBuffer: true`. The long edge is scaled down to `max_size` (default 1280), never up; `max_size: 0` keeps the full size, and so does a missing 2D context. `width` and `height` are ignored.
- **Hires**: renders again through `Graphics.take_screenshot()` in 1024 px tiles, at `width` × `height` (default: the canvas size, clamped to 1–8192). It resizes `OScreen` and the renderer and offsets the camera while it renders, so register it as `frame_end`.
- Errors: `no_camera` (hires without a camera), `capture_failed`.

---

## ConsoleBuffer & PerformanceProbe

`new ConsoleBuffer(capacity = 200, clock = () => Date.now())` keeps the last `capacity` entries. `PerformanceProbe` takes no parameters.

| Method | Returns | Description |
|--------|---------|-------------|
| `ConsoleBuffer.install(target, source?)` | — | Wraps `log`, `info`, `warn` and `error` on `target` (usually `console`) to record each call before forwarding it. With `source` (usually `window`), also records `error` and `unhandledrejection` events at level `error`. Calls `dispose()` first. |
| `ConsoleBuffer.read({ level?, limit?, since? })` | `ConsoleReadResult` | The entries with `seq` above `since`, optionally of one level, keeping the last `limit`. Pass the last `seq` read as `since` to poll. Also returns `dropped`, `total` (entries ever recorded) and `capacity`. |
| `ConsoleBuffer.dispose()` | — | Restores the console methods and removes the listeners. Keeps the entries. |
| `PerformanceProbe.read(time, screen, info?)` | `PerformanceReport` | `fps`, `smooth_fps`, `frame_ms`, `elapsed_s` from `time` (`Time`), `canvas` from `screen` (`OScreen`), and `draw_calls`, `triangles`, `geometries`, `textures` from `info` (the renderer's `info`). |

- An entry is `{ seq, level, message, at }`. Arguments are joined with spaces, objects as JSON and errors as `Name: message`; a message over 2000 characters is truncated. Lines logged before `install()` are not recorded.
- The probe leaves out a counter `info` does not have rather than reporting 0, and reports 0 fps for a zero `delta_time`.

---

## InputSynthesizer

Sends genuine DOM events at the elements PIT and `KeyboardInput` already listen on, so synthetic input takes the same path as a user's. PIT clears `pressed` and `released` at the end of every frame, so presses and releases are separated by real waits; register these as `immediate`.

### Constructor

| Parameter | Description |
|-----------|-------------|
| `dispatch(type, init)` | Dispatches one event: `mousemove`, `mousedown`, `mouseup`, `wheel`, `keydown` or `keyup`. `init` already has `bubbles` and `cancelable`. |
| `sleep(ms)` | Returns a promise that resolves after `ms`. |
| `to_client(x, y, space)` | Turns a point into `clientX`/`clientY`. `space` is `'pixels'` (default) or `'ndc'`. |

### Methods

All return `Promise<InputResult>`: the event types sent, in order, in `dispatched`, plus the client points (`at`, or `from`/`to`) and the `code` or `delta`.

| Method | Description |
|--------|-------------|
| `pointer({ x, y, action?, button?, space?, hold_ms? })` | `click` (default): move, down, wait `hold_ms` (default 60), up. `down` moves and presses, `up` only releases, `move` only moves. `button` is `left` (default), `middle` or `right`. |
| `drag({ from, to, steps?, duration_ms?, button?, space? })` | Presses at `from`, moves to `to` in `steps` moves (default 8, max 120) over `duration_ms` (default 240), releases at `to`. |
| `scroll({ delta, x?, y?, space? })` | One `wheel` event with `deltaY = delta` at (`x`, `y`), default (0, 0). |
| `key({ code, action?, hold_ms? })` | `press` (default): `keydown`, wait, `keyup`. Also `down` and `up`. Sets both `code` and `key` to `code`. |

- Waits are capped at 10 seconds. Only mouse, wheel and keyboard events are sent, no touch or pointer events.
- Errors: `bad_request`.

---

## ViewNavigator & RenderModeRegistry

`ViewNavigator` takes no parameters and gets `ViewManager` per call. `new RenderModeRegistry(descriptors)` takes `{ name, description?, options?, factory(options) }` entries: render modes do not share a constructor signature, so the app writes a factory per mode with its defaults.

| Method | Returns | Description |
|--------|---------|-------------|
| `ViewNavigator.list(manager)` | `{ current, views }` | Each view's `name`, `url` and whether it is `current`. `current` is `'current_initial'` before the first navigation. |
| `ViewNavigator.go(manager, { name, change_url?, skip? })` | `NavigateResult` | Checks that the view exists, then calls `go_to_view(name, change_url = true, skip = false)`. Returns `requested`, `current` as reported right after the call, `change_url` and `skip`. |
| `RenderModeRegistry.list()` | `RenderModeSummary[]` | `name`, `description` (default `''`) and `options` (default `[]`). |
| `RenderModeRegistry.create(name, options)` | `unknown` | The factory's result, for a case-insensitive `name`. It does not activate it: pass it to `Graphics.set_state()`. |

- Errors: `not_found` (`go`), `unknown_render_mode` (`create`). Both list the valid names.

---

## DebugDrawer

Draws through `Debug` and tracks what it drew, so `clear()` removes those helpers and never the ones the app draws itself. `new DebugDrawer({ sdf_font?, load_sdf_font? })` takes the URL of the default `sdf_text` font and a `(layout_url, atlas_url) => Promise<{ layout, atlas }>` font loader (default: fetch the JSON, load the atlas with `TextureLoader`).

| Method | Returns | Description |
|--------|---------|-------------|
| `draw(debug, root, { shape, position?, size?, color?, text?, font?, object? })` | `DebugDrawResult`, or a promise of it for `sdf_text` | Draws one helper and returns its `id` (uuid), `shape` and the tracked `helpers` count. `position` defaults to the origin, `size` to 1, `color` to the `Debug` method's default. |
| `clear({ id? })` | `DebugClearResult` | Removes one helper by `id`, or all of them. Disposes their geometries, materials and label textures. Returns `removed` and the `helpers` left. |

| Shape | Draws |
|-------|-------|
| `cube`, `sphere` | `Debug.draw_cube` / `draw_sphere`. `size` is the edge / the radius. |
| `plane` | `Debug.draw_plane(size, size)` moved to `position`. |
| `math_sphere` | `Debug.draw_math_sphere` with a `Sphere(position, size)`. |
| `bounding_box` | `Debug.draw_bounding_box` around `object` (`{ uuid }` or `{ name }`, searched under `root`). Fails on an object with no geometry. |
| `label` | `Debug.draw_label`: `text` of 1–200 characters, `size` tall, facing the camera. |
| `sdf_text` | `text` in its own `SDFTextBatch`, white by default. `font` (or `sdf_font`) is an msdf-atlas-gen `.json` layout with its `.png` atlas next to it, generated with `-yorigin bottom`. |

- `Debug` adds `math_sphere` and `bounding_box` to `SceneManager.current`, and the rest to `Debug.scene`.
- Each font loads once per URL and is shared, so `clear()` never disposes an atlas. A failed load is forgotten and retried on the next request.
- Errors: `bad_request`, `not_found`.

---

## ModelLoader

`new ModelLoader(load_gltf, resources)`: `load_gltf(url, draco)` returns a promise of a glTF (`{ scene }`), and `resources` is usually `ResourceContainer`.

| Method | Returns | Description |
|--------|---------|-------------|
| `load(scene, { name, url, version?, draco? })` | `Promise<ModelSummary>` | Loads the model, stores it with `resources.replace_resource(name, url, gltf)`, names its root `name` and adds it to `scene`. Returns `name`, `meshes`, `triangles` and `bounding_box` (`{ min, max }`, or `null`). |

- `version` is appended as `?v=<version>`, so a file replaced at the same URL is not served from the browser cache.
- A direct child of `scene` with the same name is removed, its geometries and materials are disposed, and the new model takes its position, rotation and scale.
- Errors: `bad_request`, `not_found` (no scene), `load_failed`, `not_ready` (the dev server answered with its HTML page), or the `code` of an error thrown by `load_gltf`.

---

## Usage

```ts
// Dev only: reach this code through a dynamic import behind import.meta.env.DEV.
const bridge = new DevBridge();
const inspector = new SceneInspector();
const editor = new SceneEditor();
const capture = new CaptureService(Graphics, () => CameraManager.current !== undefined);
const console_buffer = new ConsoleBuffer();

console_buffer.install(console, window);

bridge.register('inspect_scene', 'immediate', (args) => inspector.inspect(SceneManager.current, args));
bridge.register('get_console', 'immediate', (args) => console_buffer.read(args));
bridge.register('set_object', 'frame_end', (args) => editor.set(SceneManager.current, args, args));
bridge.register('capture_viewport', 'frame_end', (args) => capture.capture(args));

bridge.init({ port: 7317, app_info: () => this.app_info() });

// In the application:
on_frame_end()
{
  bridge.on_frame_end();
}
```

The boilerplate's `app/js/components/DevBridgeController.ts` registers every command the ohzi-mcp server sends.
