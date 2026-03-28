# Debug

A singleton that provides a debug visualization layer rendered on top of the main scene. Offers drawing primitives (arrows, lines, cubes, spheres, etc.) for both the 3D scene and a 2D canvas overlay. All 3D debug objects are added to a dedicated debug scene that is rendered after the main scene each frame.

## Singleton Export

```ts
import { Debug } from './Debug';
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `scene` | `Scene` | A separate Three.js scene for 3D debug geometry. Rendered after the main scene. |
| `camera` | `PerspectiveCamera` | Debug camera (initialized with `clear_alpha = 0` so the main scene shows through). |
| `ctx` | `any` | Optional 2D canvas context for drawing 2D overlays (rectangles, 2D lines). |
| `display_texture_meshes` | `Mesh[]` | Meshes used by `draw_texture` to display textures on screen. |
| `rt_debug` | `RenderTarget` | Optional render target for debug output. |
| `Vector3_zero` | `Vector3` | Convenience constant `(0, 0, 0)`. |
| `Vector3_one` | `Vector3` | Convenience constant `(1, 1, 1)`. |

## Methods

### Lifecycle (called by RenderLoop)

| Method | Description |
|--------|-------------|
| `init()` | Creates the debug scene, camera, and resets state. Called once during startup. |
| `render(graphics)` | Updates screen-space texture sizes, then renders the debug scene using `CameraManager.current` if it contains any children. Called each frame after `on_post_render`. |
| `clear()` | Clears the 2D canvas overlay. Called at the end of each frame. |

### 3D Drawing (added to debug scene)

All 3D draw methods add objects to `Debug.scene` and return the created object.

| Method | Signature | Description |
|--------|-----------|-------------|
| `draw_arrow` | `(origin, dir, color?)` | Arrow from `origin` in direction `dir`. Length derived from `dir`. |
| `draw_axis` | `()` | An XYZ axis helper. |
| `draw_line` | `(points, color?)` | A line through the given `Vector3[]` points. |
| `draw_cube` | `(pos?, size?, color?)` | A solid cube at `pos` with uniform `size`. |
| `draw_oriented_cube` | `(from, to, height?, color?, depth?)` | A cube oriented along the `from→to` direction. |
| `draw_plane` | `(width?, height?, color?)` | A transparent plane with custom shader. Rendered behind everything (`renderOrder = -10000`). |
| `draw_empty_cube` | `(pos, size, color)` | A wireframe `Box3Helper`. Note: not added to the debug scene automatically. |
| `draw_sphere` | `(pos, size, color)` | A solid sphere. |
| `draw_point_array` | `(points, open?, color?)` | A smooth Catmull-Rom curve through the given points (200 samples). |
| `draw_curve` | `(curve, options?)` | Line segments connecting consecutive points, with an optional Y offset. |
| `draw_texture` | `(tex, w, h)` | Displays a texture on a screen-space quad. The quad's screen size is updated each frame in `render()`. |

### 3D Drawing (added to main scene)

These methods add objects to `SceneManager.current` instead of the debug scene:

| Method | Signature | Description |
|--------|-----------|-------------|
| `draw_sphere_helper` | `(sphere, color)` | A solid sphere at `sphere.center` with `sphere.radius`. |
| `draw_math_sphere` | `(sphere)` | A transparent sphere at `sphere.center` with `sphere.radius`. |
| `draw_bounding_box` | `(bb)` | A `Box3Helper` for the given `Box3`. |

### 2D Drawing (requires `ctx`)

These require `Debug.ctx` to be set to a `CanvasRenderingContext2D`:

| Method | Signature | Description |
|--------|-----------|-------------|
| `draw_rectangle` | `(position_2d, width, height, color)` | Filled rectangle centered at the given 2D position. Y-axis is flipped to match screen coordinates. |
| `draw_line_2D` | `(from, to, color)` | A straight line between two 2D points. |

### Utility

| Method | Signature | Description |
|--------|-----------|-------------|
| `set_debug_RT` | `(RT)` | Stores a render target reference for external debug use. |
