# AbstractScene

Extends Three.js `Scene` with a two-phase asset loading pipeline (regular → high quality), lifecycle hooks for the render loop, and scene disposal utilities.

## Export

```ts
import { AbstractScene } from './scenes/AbstractScene';
```

**Abstract base class** — not meant to be used directly. Create a subclass that extends `AbstractScene` to define scene-specific assets, setup logic, and callbacks.

```ts
class MyScene extends AbstractScene
{
  constructor()
  {
    super({ name: 'my_scene', compilators: { SceneCompilator, TexturesCompilator, AudiosCompilator } });

    this.set_assets(sceneObjects, sceneTextures, sceneSounds);
  }

  init()
  {
    super.init();
    // One-time scene setup (create meshes, lights, etc.)
  }

  on_assets_ready()
  {
    // All regular assets downloaded — access them via ResourceContainer.get()
  }

  on_assets_compiled()
  {
    super.on_assets_compiled();
    // Assets compiled and ready to render
  }

  on_pre_render()
  {
    // Per-frame work before rendering (e.g., update uniforms)
  }
}
```

## Constructor

| Parameter | Description |
|-----------|-------------|
| `name` | Unique scene identifier. Also used to namespace asset loading workers. |
| `compilators` | An object providing `SceneCompilator`, `TexturesCompilator`, and `AudiosCompilator` classes used to post-process loaded assets. |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Scene identifier. |
| `initialized` | `boolean` | `true` after `init()` has been called. |
| `is_loaded` | `boolean` | `true` after regular-quality assets are loaded and compiled. |
| `is_high_loaded` | `boolean` | `true` after high-quality assets are loaded. |
| `camera_controller` | `CameraController` | Optional camera controller associated with this scene. |
| `loading_states` | `{ regular, high }` | The two loading state instances. |
| `current_loading_state` | `LoadingState` | The currently active loading state. |

## Computed Properties

| Property | Type | Description |
|----------|------|-------------|
| `loading_progress` | `number` | Delegates to `current_loading_state.loading_progress` — a 0–1 value representing combined loader progress. |

## Methods

### Lifecycle

| Method | Description |
|--------|-------------|
| `init()` | Marks the scene as initialized. Called automatically by `load()` if not already called. Override to perform one-time scene setup. |
| `load()` | Calls `init()` if needed, switches to the `regular` loading state, and begins loading assets. |
| `update()` | Called each frame. Delegates to `update_loading_state()` which advances the current loading state until high-quality assets are fully loaded. |

### Render Hooks

Called by render modes (e.g., `NormalRender`) each frame:

| Method | Description |
|--------|-------------|
| `on_pre_render()` | Called before the scene is rendered. Override for pre-render setup. |
| `render()` | Renders the scene using `Graphics.render(this, CameraManager.current)`. |
| `on_post_render()` | Called after the scene is rendered. Override for post-render work. |

### Asset Callbacks

Override these in subclasses to react to loading milestones:

| Method | When called |
|--------|-------------|
| `on_assets_ready()` | All regular-quality assets have finished downloading (but may not yet be compiled). Called once. |
| `on_assets_compiled()` | All regular-quality assets are downloaded **and** compiled. Sets `is_loaded = true`, then automatically begins loading high-quality assets. |
| `on_high_quality_assets_ready()` | All high-quality assets have finished loading. Sets `is_high_loaded = true`. |

### Asset Registration

| Method | Description |
|--------|-------------|
| `set_assets(objects, textures, sounds, custom_loaders?, custom_compilators?, custom_data?)` | Defines the regular-quality asset manifest. |
| `set_high_assets(objects, textures, sounds, custom_loaders?, custom_compilators?, custom_data?)` | Defines the high-quality asset manifest. |

### Disposal

| Method | Description |
|--------|-------------|
| `dispose()` | Disposes all mesh materials, textures (maps), and geometries. Resets `initialized` to `false`. |
| `dispose_cpu()` | Replaces geometry attribute arrays and texture mipmap data with tiny stubs to free CPU-side memory while keeping GPU resources alive. Resets `initialized` to `false`. |
| `get_objects()` | Returns an array of all `Mesh` children that have geometry. |

---

## Loading Pipeline

AbstractScene uses a state-machine of `LoadingState` subclasses to manage a two-phase loading process.

### Loading Flow

```
scene.load()
  │
  ├─ init()                          ← one-time setup
  └─ set_loading_state(regular)      ← switch to RegularLoadingState
       └─ load()                     ← start async loaders
            │
            ▼
  ┌─ RegularLoadingState.update() ─── called each frame ───┐
  │                                                        │
  │  all loaders finished?                                 │
  │    ├─ yes → on_assets_ready()        (called once)     │
  │    │        all compilators done?                      │
  │    │          ├─ yes → on_assets_compiled()            │
  │    │          │          ├─ is_loaded = true           │
  │    │          │          └─ switch to HighQualityState │
  │    │          │               └─ load()                │
  │    │          └─ no  → continue next frame             │
  │    └─ no  → continue next frame                        │
  └────────────────────────────────────────────────────────┘
            │
            ▼
  ┌─ HighQualityLoadingState.update() ─ called each frame ─┐
  │                                                        │
  │  all loaders finished?                                 │
  │    ├─ yes → on_high_quality_assets_ready()             │
  │    │          └─ is_high_loaded = true                 │
  │    │             (loading stops advancing)             │
  │    └─ no  → continue next frame                        │
  └────────────────────────────────────────────────────────┘
```

### LoadingState (base)

The base class that coordinates async loaders and sequential compilators.

| Method / Property | Description |
|-------------------|-------------|
| `set_assets(objects, textures, sounds, ...)` | Stores the asset manifest for later use by `setup_loader()`. |
| `load()` | Calls `setup_loader()` to create loaders and compilators, then starts the first loader. All loaders share the same web worker. |
| `setup_loader()` | Creates `AsyncObjectsLoader`, `AsyncTexturesLoader`, `AsyncAudiosLoader`, plus any custom loaders. Pairs each with its compilator. |
| `is_loaded()` | Returns `true` when every loader reports finished. |
| `is_compiled()` | Advances the `CompilatorManager` and returns `true` when all compilators have finished. |
| `loading_progress` | Average progress (0–1) across all loaders. |
| `on_enter()` / `on_exit()` | State transition hooks (empty in base). |

### RegularLoadingState

When `update()` detects all loaders are done, it calls `scene.on_assets_ready()` (once), then checks compilators each frame. Once compilation finishes, it calls `scene.on_assets_compiled()`.

### HighQualityLoadingState

When `update()` detects all loaders are done, it immediately calls `scene.on_high_quality_assets_ready()`. Compilation checking is currently bypassed.

---

## CompilatorManager

Runs an array of `Compilator` instances **sequentially**, one per frame cycle:

1. Calls `start()` on the current compilator.
2. On the next update, calls `update()` which sets `finished = true`.
3. Moves to the next compilator.

This spreads compilation work across frames to avoid long blocking operations.

### Compilator (base)

| Method | Description |
|--------|-------------|
| `start()` | Sets `finished = false`. Override to begin compilation work. |
| `update()` | Sets `finished = true`. Override to perform incremental work and set `finished` when done. |
