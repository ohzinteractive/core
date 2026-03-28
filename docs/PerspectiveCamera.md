# PerspectiveCamera

A thin extension of Three.js `PerspectiveCamera` that adds per-camera clear color and alpha properties. These allow the rendering pipeline to associate a background clear color with each camera individually.

## Export

```ts
import { PerspectiveCamera } from './PerspectiveCamera';
```

Not a singleton — instantiated as needed.

## Constructor

```ts
new PerspectiveCamera(fov: number, aspect: number, near: number, far: number)
```

Parameters are identical to Three.js `PerspectiveCamera`. Additionally initializes:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `clear_color` | `Color` | `#000000` (black) | Background color used when clearing the framebuffer before rendering with this camera. |
| `clear_alpha` | `number` | `1` | Alpha value used with the clear color. |

## Methods

### `copy(camera: PerspectiveCamera): this`

Copies all properties from another `PerspectiveCamera`, including the base Three.js camera state and the additional `clear_color` and `clear_alpha` values. Returns `this` for chaining.
