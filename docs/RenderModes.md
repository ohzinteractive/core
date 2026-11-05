# RenderModes

A render mode is the strategy `Graphics` uses to draw `SceneManager.current` with `CameraManager.current` each frame. Each mode extends `BaseRender`. Pick one with `Graphics.set_state()`. Use `NormalRender` for plain forward rendering. Switch to a post-processing mode (bloom, SSAO, deferred lights) or a debug view when you need one. Extend `BaseRender` to write your own pipeline.

## Export

```ts
import { BaseRender } from './render_mode/BaseRender';
import { NormalRender } from './render_mode/NormalRender';
import { BloomRender } from './render_mode/BloomRender';
import { UnrealBloomRender } from './render_mode/UnrealBloomRender';
import { NormalAORender } from './render_mode/NormalAORender';
import { DeferredRender } from './render_mode/DeferredRender';
import { VRRender } from './render_mode/VRRender';
import { DebugNormalsRender } from './render_mode/DebugNormalsRender';
```

Not singletons. Instantiate them as needed. `Graphics` keeps one active instance in `Graphics.current_render_mode`. Until you call `set_state()`, that instance is `Graphics.no_render`, a plain `BaseRender` that draws nothing.

## Mode Lifecycle

```
Graphics.set_state(new_mode)
  ├─ current_render_mode.on_exit(Graphics, renderer)
  ├─ current_render_mode = new_mode
  └─ new_mode.on_enter(Graphics, renderer)

Graphics.update()                              ← every frame
  ├─ generate_depth_normal_texture?  → fill Graphics.depth_normals_RT
  └─ CameraManager.current set?      → current_render_mode.render()

Graphics.take_screenshot(...)                  → render() once per tile
Graphics.dispose()                             → current_render_mode.dispose()
```

`resize()` is never called by core. Modes that own render targets resize them at the start of `render()` to match `OScreen`.

---

## BaseRender

The base class and interface for every render mode. All its methods are empty. Override what your mode needs.

### Methods

| Method | Description |
|--------|-------------|
| `render(renderer?)` | Draws one frame. Called by `Graphics.update()` and by `Graphics.take_screenshot()`. `Graphics` calls it without arguments. |
| `on_enter(context, renderer)` | Called by `Graphics.set_state()` when the mode becomes active. `context` is `Graphics`. Allocate GPU resources or set `Graphics` flags here. |
| `on_exit(context, renderer)` | Called by `Graphics.set_state()` on the outgoing mode. Free what `on_enter` built. |
| `resize()` | Hook for resize handling. Core never calls it. |
| `dispose()` | Called by `Graphics.dispose()` on the active mode. Every built-in mode inherits the empty version. |

### Scene Hooks

Only `NormalRender` and `VRRender` go through the scene's `on_pre_render()`, `render()` and `on_post_render()` hooks. The other built-in modes call `Graphics.render(SceneManager.current, ...)` directly, so overrides of those `AbstractScene` hooks don't run under them.

---

## NormalRender

Plain forward rendering. It clears the canvas (depth and stencil), then calls `SceneManager.current.on_pre_render()`, `render()` and `on_post_render()`. This is the mode the boilerplate's `GraphicsInitializer` sets.

### Constructor

No parameters.

---

## BloomRender

Renders the scene to a target, blurs a copy, and composes the blur over the scene on the canvas.

### Constructor

| Parameter | Description |
|-----------|-------------|
| `use_dual_filtering` | Default `false`, which blurs with the box `Blurrer`. `true` blurs with `DualFilteringBlurrer` (Kawase), which spreads the glow much wider. |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `use_dual_filtering` | `boolean` | The constructor flag. Read by `on_enter()` when it builds the blurrer. |
| `bloom_compose_mat` | `BloomComposeMaterial` | Composes the blur over the scene. Its `uniforms._BloomStrength.value` scales the glow (default `1`). |
| `blurrer` | `Blurrer \| DualFilteringBlurrer` | Built in `on_enter()`, `undefined` before that. |
| `main_RT` | `RenderTarget` | The scene at `OScreen` size. Built in `on_enter()`. |
| `blur_RT` | `RenderTarget` | The blurred copy. Built in `on_enter()`. |

### Methods

| Method | Description |
|--------|-------------|
| `on_enter()` | Builds the blurrer and both render targets. |
| `on_exit()` | Disposes the blurrer and both render targets. The mode can be entered again, and it rebuilds them. |

`render()` needs the resources built by `on_enter()`, so always activate this mode through `Graphics.set_state()`.

---

## UnrealBloomRender

Unreal-style bloom. It renders the scene to `main_RT`, then runs a five-mip Gaussian blur, optionally after a luminosity high pass. It sums the mips with per-mip tints and adds the result over the scene on the canvas.

### Constructor

| Parameter | Description |
|-----------|-------------|
| `use_antialiasing` | Required. `true` renders `main_RT` with 4 MSAA samples, `false` with 1. |
| `use_half_float` | Required. `true` uses `HalfFloatType` targets, `false` uses `UnsignedByteType`. |
| `use_hight_luminosity_pass` | Required (spelled this way in the code). `true` blurs only pixels above the luminosity threshold. `false` blurs the whole frame. |
| `use_rendering_size` | Default `false`, which sizes `main_RT` from `OScreen.width/height`. `true` sizes it from `OScreen.render_width/render_height` (scaled by DPR). |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `main_RT` | `RenderTarget` | The scene target. Linear color space, nearest filtering. |
| `blurrer` | `GaussianBlurrer` | Owns the high pass and the horizontal and vertical mip targets. |
| `bloom_compose_mat` | `UnrealBloomComposeMaterial` | Sums the five blurred mips. |
| `add_mat` | `AddMaterial` | Adds the composed bloom over `main_RT` on the canvas. |
| `use_hight_luminosity_pass` | `boolean` | Whether `render()` runs the high pass. Can be changed at runtime. |
| `use_rendering_size` | `boolean` | Which `OScreen` size `main_RT` follows. Can be changed at runtime. |

### Methods

#### Lifecycle

| Method | Description |
|--------|-------------|
| `on_enter()` | Binds the blurrer's mip textures to the compose and add materials. |

#### Bloom Controls

| Method | Description |
|--------|-------------|
| `set_bloom_strength(val)` | Scales the composed bloom. Default `1`. |
| `set_bloom_radius(val)` | Sets the radius of the blurrer's separable blur materials. |
| `set_luminosity_threshold(value)` | Sets the high pass threshold (0–1). Default `0.23`. Only affects the frame when `use_hight_luminosity_pass` is `true`. |
| `set_tint_color_0(col_string)` … `set_tint_color_4(col_string)` | Tints one mip, from finest (`0`) to widest (`4`). Takes any string `Color.set()` accepts, such as `'#ff8800'`. Default white. |

---

## NormalAORender

Forward rendering with screen-space ambient occlusion. `on_enter()` sets `Graphics.generate_depth_normal_texture = true`. `render()` then draws the scene to `main_RT` and computes SSAO from `Graphics.depth_normals_RT` into `SSAO_RT`. It box-blurs the result and darkens the scene with it on the canvas.

### Constructor

| Parameter | Description |
|-----------|-------------|
| `use_ssaa` | Default `false`. `true` renders `main_RT` at twice the `OScreen` size (supersampling). `SSAO_RT` stays at 1×. |
| `use_exact_depth` | Default `true`, which decodes and interpolates depth from the four nearest texels and avoids banding on flat surfaces. `false` uses one filtered fetch per sample, which roughly halves the SSAO pass cost but bands flat surfaces. |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `ssaa` | `number` | Supersampling factor: `2` with `use_ssaa`, otherwise `1`. |
| `main_RT` | `RenderTarget` | The scene at `OScreen` size × `ssaa`. |
| `SSAO_RT` | `RenderTarget` | The occlusion term at `OScreen` size. |
| `ssao_mat` | `SSAOMaterial` | Computes occlusion from the depth and normals target. |
| `ssao_compose_mat` | `SSAOComposeMaterial` | Darkens the scene by the blurred occlusion. |
| `blurrer` | `Blurrer` | Blurs `SSAO_RT` in place. |

### Methods

| Method | Description |
|--------|-------------|
| `on_enter()` | Turns on `Graphics.generate_depth_normal_texture`. |

There's no `on_exit()`, so the depth and normals pass keeps running every frame after you switch to another mode. Set `Graphics.generate_depth_normal_texture = false` yourself if the next mode doesn't need it.

---

## DeferredRender

A deferred point-light pass over the depth and normals buffer. It renders the scene to `main_rt` as albedo. It then clears the canvas and renders `scene_lights`, a scene of light-volume spheres whose `DeferredPointLightMaterial` reads albedo, depth and normals at screen UV.

### Constructor

No parameters. It fills `scene_lights` with a fixed 2×2 grid of unit-intensity point lights at `y = 1`, spaced 2 units apart around the origin. Edit `scene_lights` to place your own.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `main_rt` | `RenderTarget` | The albedo target at `OScreen` size. |
| `scene_lights` | `AbstractScene` | The light volumes, named `lights_scene`. Each mesh's material receives the targets and the inverse projection every frame. |
| `camera_inverse_proj_mat` | `Matrix4` | Inverse of `CameraManager.current.projectionMatrix`, refreshed every frame. |

### Methods

| Method | Description |
|--------|-------------|
| `on_enter()` | Turns on `Graphics.generate_depth_normal_texture`. Like `NormalAORender`, the mode never turns it off. |

---

## VRRender

For WebXR sessions (`Graphics.init()` with `core_attributes.xr_enabled: true`). The stereo views come from three's XR manager. This mode calls the scene's hooks and renders it without clearing it first, because XR mode leaves `autoClear` on. If the current scene has no `render()` method, it falls back to `Graphics.render()` into the renderer's current target. It also mirrors the headset view onto the canvas through a spectator camera.

### Constructor

No parameters.

### Methods

| Method | Description |
|--------|-------------|
| `render_spectator_camera()` | Called by `render()` between `render()` and `on_post_render()`. If `CameraManager.spectator` is set and an XR session is presenting, it copies the XR camera pose and the current camera's projection onto the spectator, then renders the scene once to the canvas with XR paused. It does nothing otherwise. |

---

## DebugNormalsRender

Clears the canvas and renders the scene with one `NormalMaterial` override, showing world-space normals as colors. Scene hooks don't run.

### Constructor

No parameters.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `normal_material` | `NormalMaterial` | The override, built once because node materials compile per instance. |

---

## Usage

```ts
const normal_render = new NormalRender();
const bloom_render = new UnrealBloomRender(true, true, true);

bloom_render.set_bloom_strength(1.5);
bloom_render.set_luminosity_threshold(0.6);
bloom_render.set_tint_color_4('#ff8800');

Graphics.set_state(normal_render);

// Later, e.g. on entering a night view:
Graphics.set_state(bloom_render);

// Custom mode that keeps the scene hooks:
class OutlineRender extends BaseRender
{
  render()
  {
    Graphics.clear(undefined, CameraManager.current, true, true);
    SceneManager.current.on_pre_render();
    SceneManager.current.render();
    SceneManager.current.on_post_render();
  }
}
```
