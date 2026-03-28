# OScreen

A singleton that tracks the application's canvas dimensions, position, device pixel ratio (DPR), and provides utilities for coordinate and pixel-density conversions. It acts as the single source of truth for screen metrics consumed across the rendering pipeline.

## Singleton Export

```ts
import { OScreen } from './OScreen';
```

`OScreen` is instantiated once and exported as a singleton. The deprecated `Screen` class delegates all calls to `OScreen`.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `width` | `number` | Logical width of the canvas in CSS pixels. |
| `height` | `number` | Logical height of the canvas in CSS pixels. |
| `render_width` | `number` | Physical rendering width (`width * dpr`). |
| `render_height` | `number` | Physical rendering height (`height * dpr`). |
| `dpr` | `number` | Device pixel ratio. Set externally by `Graphics` during initialization and on resize. |
| `position` | `Vector2` | Canvas position on the page (set via `update_position`). |
| `pixel_size` | `Vector2` | Size of a single pixel in normalized coordinates (`1/width`, `1/height`). Useful in shaders for texel-stepping. |
| `width_height` | `Vector2` | Convenience vector holding `(width, height)`. |
| `size_changed` | `boolean` | Flag set to `true` when `update_size()` is called; reset to `false` on the next `update()`. Consumers can check this to react to resize events within a single frame. |

## Computed Properties

| Property | Type | Description |
|----------|------|-------------|
| `aspect_ratio` | `number` | `width / height`. Used to configure camera projections and frustum fitting. |
| `portrait` | `boolean` | `true` when `width < height`. |

## Methods

### `init()`

Resets all properties to their defaults (dimensions to 1, DPR to 1, position to origin). Called once during application startup by `Initializer`.

### `update()`

Resets `size_changed` to `false`. Called at the start of each frame by `Graphics.update()` so the flag is only `true` during the frame in which a resize occurred.

### `update_size(width: number, height: number)`

Updates all dimension-related properties:
- Sets `width`, `height`, and `width_height`.
- Recomputes `pixel_size` as `(1/width, 1/height)`.
- Recomputes `render_width` and `render_height` using the current `dpr`.
- Sets `size_changed` to `true`.

Called by `Graphics.on_resize()` whenever the canvas size changes.

### `update_position(x: number, y: number)`

Updates the `position` vector with the canvas's page coordinates. Called by `Graphics.on_resize()`.

### `apply_pixel_density(value: number): number`

Converts a physical-pixel value to logical pixels by dividing by `dpr`.

### `apply_pixel_density_v2(vector2: Vector2): Vector2`

In-place version of `apply_pixel_density` for a `Vector2`. Mutates and returns the same vector.

### `get_pixel_size(): Vector2`

Returns the `pixel_size` vector.

## Lifecycle

```
Initializer.init()
  └─ OScreen.init()              ← reset to defaults

Graphics.init({ dpr })
  └─ OScreen.dpr = dpr           ← set device pixel ratio

Graphics.on_resize()             ← triggered by ResizeObserver
  ├─ OScreen.dpr = dpr
  ├─ OScreen.update_position(x, y)
  └─ OScreen.update_size(w, h)   ← sets size_changed = true

Each frame:
  Graphics.update()
    └─ OScreen.update()           ← resets size_changed = false
```

## Usage

OScreen is read throughout the codebase to:

- **Size render targets** — render modes (Bloom, Deferred, SSAO, etc.) create and resize `RenderTarget` objects to match `OScreen.width` / `OScreen.height`.
- **Configure cameras** — `CameraManager`, `CameraController`, and `CameraUtilities` read `aspect_ratio` to set projection matrices.
- **Convert coordinates** — `CameraUtilities` uses `width` and `height` to project world positions to screen positions.
- **Set renderer viewport** — `Graphics` uses `render_width` / `render_height` ("physical pixels") to configure the viewport and canvas buffer size.
- **Screenshot tiling** — `Graphics.take_screenshot()` temporarily overrides `OScreen` dimensions to render high-resolution captures in tiles, then restores the original size.
