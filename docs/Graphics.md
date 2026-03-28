# Graphics

A singleton that wraps the Three.js WebGPU `Renderer` and manages the rendering pipeline. Handles scene rendering, render mode switching, camera updates, post-processing (blitting), depth/normal generation, resize handling, and screenshot capture.

## Singleton Export

```ts
import { Graphics } from './Graphics';
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `_renderer` | `Renderer` | The Three.js WebGPU renderer instance. |
| `canvas` | `HTMLCanvasElement` | The renderer's DOM element. |
| `current_render_mode` | `BaseRender` | The active render mode (controls how the scene is drawn). Defaults to `no_render`. |
| `blitter` | `Blitter` | Utility for full-screen blit passes and post-processing. |
| `depth_and_normals_renderer` | `DepthAndNormalsRenderer` | Generates depth/normal textures when enabled. |
| `generate_depth_normal_texture` | `boolean` | When `true`, depth/normal textures are regenerated each frame. Default: `false`. |
| `core_attributes` | `CoreAttributes` | Configuration flags (e.g., `xr_enabled`). |
| `no_render` | `BaseRender` | A no-op render mode used as the default. |

## Computed Properties

| Property | Type | Description |
|----------|------|-------------|
| `dom_element` | `HTMLCanvasElement` | Alias for `_renderer.domElement`. |
| `depth_normals_RT` | `RenderTarget` | The render target containing depth/normal data. |

## Methods

### Initialization & Lifecycle

| Method | Description |
|--------|-------------|
| `init({ renderer, core_attributes, dpr })` | Initializes the renderer, sets pixel ratio, creates the `Blitter` and `DepthAndNormalsRenderer`, configures XR if enabled. Disables `autoClear` for non-XR setups. |
| `dispose()` | Disposes the renderer, current render mode, and blitter. |

### Frame Update (called by RenderLoop)

#### `update()`

Called once per frame by the RenderLoop. Executes in order:

1. If `generate_depth_normal_texture` is enabled, renders the depth/normals pass.
2. Updates the current camera's aspect ratio, projection matrix, and world matrix.
3. If `CameraManager.current` exists, calls `current_render_mode.render()`.
4. Calls `OScreen.update()` to reset the `size_changed` flag.

### Render Modes

| Method | Description |
|--------|-------------|
| `set_state(new_state)` | Switches render mode. Calls `on_exit` on the old mode and `on_enter` on the new one. |

Render modes (e.g., `NormalRender`, `BloomRender`, `DeferredRender`) implement the `BaseRender` interface and control how the scene is drawn each frame.

### Rendering

| Method | Description |
|--------|-------------|
| `render(scene?, camera?, RT?, override_mat?)` | Renders a scene to an optional render target with an optional override material. Falls back to `SceneManager.current` and `CameraManager.current`. |
| `render_scene(scene)` | Calls `on_pre_render()`, `render()`, and `on_post_render()` on the scene if those methods exist. |
| `compile(scene, camera, RT, override_mat)` | Asynchronously compiles shaders for the scene. |
| `compile_async(scene, camera, RT, override_mat, target_scene)` | Asynchronously compiles shaders via `compileAsync`, returning a promise. |
| `clear(RT, camera, clear_depth, clear_stencil)` | Clears a render target. If a camera is provided, uses its `clear_color` and `clear_alpha`. |

### Post-Processing (Blitting)

| Method | Description |
|--------|-------------|
| `blit(src_RT, dst_RT, mat?)` | Copies a render target to another. If `mat` is provided, applies it as a full-screen pass. |
| `blit_clear_with_material(dst_RT, mat)` | Clears and blits to a render target using a material. |
| `material_pass(mat, dst?)` | Runs a full-screen material pass to the optional destination. |

### Resize Handling

#### `on_resize(entries, dpr)`

Called by a `ResizeObserver`. For each entry:

1. Updates `OScreen` with the new DPR, position, and size.
2. Resizes the canvas buffer to match `OScreen.render_width/render_height`.
3. Updates the renderer viewport and size.
4. Recalculates the current camera's projection.

### Screenshots

#### `take_screenshot(blob_callback, width?, height?)`

Captures a high-resolution screenshot by tiling:

1. Divides the target resolution into 1024×1024 tiles.
2. Temporarily overrides `OScreen` size and renderer pixel ratio.
3. Renders each tile using `setViewOffset` to pan the camera.
4. Composites tiles onto a 2D canvas.
5. Converts to a PNG blob and passes it to the callback.
6. Restores original screen size, pixel ratio, and camera state.

#### `download_screenshot(blob)`

Creates a temporary download link for a blob and triggers a browser download as `Snapshot.png`.

### Utilities

| Method | Description |
|--------|-------------|
| `readback_RT(RT)` | Asynchronously reads render target pixels back to the CPU. Returns a `Promise<TypedArray>`. |
