# OrthographicCamera

A thin extension of Three.js `OrthographicCamera` that adds per-camera clear color and alpha properties, mirroring the same additions found in the framework's `PerspectiveCamera`.

## Export

```ts
import { OrthographicCamera } from './OrthographicCamera';
```

Not a singleton — instantiated as needed.

## Constructor

```ts
new OrthographicCamera(left: number, right: number, top: number, bottom: number, near: number, far: number)
```

Parameters are identical to Three.js `OrthographicCamera`. Additionally initializes:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `clear_color` | `Color` | `#000000` (black) | Background color used when clearing the framebuffer before rendering with this camera. |
| `clear_alpha` | `number` | `1` | Alpha value used with the clear color. |

## Methods

### `copy(camera: OrthographicCamera): this`

Copies all properties from another `OrthographicCamera`, including the base Three.js camera state and the additional `clear_color` and `clear_alpha` values. Returns `this` for chaining.
