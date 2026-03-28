# CameraManager

A singleton that holds references to the active cameras used by the rendering pipeline.

## Singleton Export

```ts
import { CameraManager } from './CameraManager';
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `current` | `PerspectiveCamera` | The main camera used for rendering. Read by `Graphics`, render modes, `CameraUtilities`, `CameraController`, and debug rendering. Initially `undefined`. |
| `spectator` | `PerspectiveCamera` | A secondary camera intended for VR spectator views. Initially `undefined`. |

Both properties are readable and writable via getters/setters.

## Methods

### `init()`

Resets both `current` and `spectator` to `undefined`. Called once during application startup by `Initializer`.

## Usage

Application code sets `CameraManager.current` to control which camera the rendering pipeline uses:

```ts
const camera = new PerspectiveCamera(60, OScreen.aspect_ratio, 0.1, 1000);
CameraManager.current = camera;
```

The rendering pipeline reads it as the default camera:

- **Graphics** — `render()`, `compile()`, and `compile_async()` fall back to `CameraManager.current` when no explicit camera is provided.
- **Graphics.update()** — updates `CameraManager.current.aspect` to match `OScreen.aspect_ratio` each frame.
- **Render modes** — use `CameraManager.current` for scene rendering.
- **Debug** — renders its overlay using `CameraManager.current`.
