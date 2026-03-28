# SceneManager

A singleton that holds a reference to the currently active scene. It provides the default scene used by the rendering pipeline and handles full disposal of scene resources.

## Singleton Export

```ts
import { SceneManager } from './SceneManager';
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `current` | `AbstractScene` | The active scene. Readable and writable via a getter/setter. Defaults to a scene named `"default_scene"` after `init()`. |

`AbstractScene` extends Three.js `Scene`, adding loading state tracking, an optional `CameraController`, and lifecycle hooks (`on_pre_render`, `render`, `on_post_render`).

## Methods

### `init()`

Creates a default `AbstractScene` named `"default_scene"` and assigns it to `current`. Called once during application startup by `Initializer`.

### `add_scene(name: string)`

Stub — currently a no-op.

### `dispose()`

Cleans up all objects in the current scene:

1. **Traverses** every child mesh and disposes its geometry and material(s) (handles both single materials and material arrays).
2. **Removes** all children from the scene hierarchy.

Called by `Initializer` during application teardown.

## Usage

The rendering pipeline reads `SceneManager.current` as the default scene and camera source:

- **Graphics** — `render()`, `compile()`, and `compile_async()` fall back to `SceneManager.current` when no explicit scene is provided.
- **Render modes** (e.g., `NormalRender`) call `SceneManager.current.on_pre_render()`, `.render()`, and `.on_post_render()` each frame.
- **View/scene controllers** set `SceneManager.current` to switch the active scene during navigation.
