# Initializer

A singleton that bootstraps all core singletons during startup and tears them down on disposal.

## Singleton Export

```ts
import { Initializer } from './Initializer';
```

## Methods

### `init(input: Input)`

Initializes every core singleton in the required order. Called once at application startup.

| Order | Singleton | Purpose |
|-------|-----------|---------|
| 1 | `CameraManager` | Resets camera references. |
| 2 | `CameraUtilities` | Initializes camera helper functions (receives the `Input` instance). |
| 3 | `Capabilities` | Detects GPU/browser capabilities. |
| 4 | `OS` | Detects operating system and device type. |
| 5 | `Browser` | Detects browser type. |
| 6 | `ReflectionPlaneContext` | Initializes reflection plane state. |
| 7 | `ResourceContainer` | Resets the asset registry. |
| 8 | `SceneManager` | Creates the default scene. |
| 9 | `OScreen` | Resets screen dimensions. |
| 10 | `Time` | Resets timing state. |
| 11 | `Debug` | Creates the debug scene and camera. |

> **Note:** `Graphics.init()` is **not** called here — it is initialized separately since it requires a renderer instance and DPR configuration.

### `dispose(render_loop: RenderLoop)`

Tears down the application:

1. `Graphics.dispose()` — disposes the renderer, render mode, and blitter.
2. `SceneManager.dispose()` — disposes all geometry and materials in the current scene.
3. `render_loop.dispose()` — stops the render loop and resets the frame counter.
