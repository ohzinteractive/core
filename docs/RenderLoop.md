# RenderLoop

The main execution loop that orchestrates the entire frame lifecycle. It coordinates timing, input handling, fixed and variable updates, rendering, and debug visualization.

## Constructor

```ts
new RenderLoop(target_application: BaseApplication, graphics: typeof Graphics, input: Input)
```

| Parameter | Description |
|-----------|-------------|
| `target_application` | The application state that receives lifecycle callbacks. Defaults to a bare `BaseApplication` if not provided. |
| `graphics` | The rendering system (wraps the Three.js WebGPU renderer). |
| `input` | The input manager (keyboard, mouse, touch). |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `target_application` | `BaseApplication` | The current application state receiving lifecycle hooks. |
| `graphics` | `typeof Graphics` | Reference to the rendering system. |
| `input` | `Input` | Reference to the input manager. |
| `is_running` | `boolean` | Whether the loop is currently executing. |
| `frames_passed` | `number` | Total number of frames rendered since initialization. |
| `time_accumulator` | `number` | Accumulated delta time used for fixed-timestep updates. |

## Methods

### `start()`

Starts the render loop. On the very first call (`frames_passed === 0`), it invokes `target_application.on_enter()` to let the application perform initial setup. Subsequent calls after a `stop()` resume without re-triggering `on_enter()`. Internally hooks into the renderer's animation loop via `setAnimationLoop`.

### `stop()`

Stops the render loop. Calls `target_application.on_exit()` and detaches the animation loop callback. Has no effect if the loop is already stopped.

### `dispose()`

Stops the loop and resets `frames_passed` to `0`, allowing a full restart cycle (including `on_enter()`) on the next `start()` call.

### `set_state(new_state: BaseApplication)`

Swaps the current application state for a new one. Calls `on_exit()` on the outgoing state and `on_enter()` on the incoming state. This enables a finite-state-machine pattern where different `BaseApplication` subclasses represent distinct application modes.

### `update(elapsed_time: number)`

The per-frame callback driven by the renderer's animation loop. Not intended to be called manually. The `elapsed_time` parameter is in milliseconds (provided by the renderer). This method implements the entire frame pipeline described below.

## Frame Lifecycle

Each frame executes the following steps in order:

```
┌─────────────────────────────────────────────────────────┐
│ 1.  Time.__update(elapsed_time)                         │
│     Update delta time, elapsed time, smooth delta time. │
├─────────────────────────────────────────────────────────┤
│ 2.  target_application.on_post_start()                  │
│     Called once, on the second frame only.              │
├─────────────────────────────────────────────────────────┤
│ 3.  input.update()                                      │
│     Process raw input events into current-frame state.  │
├─────────────────────────────────────────────────────────┤
│ 4.  Accumulate time                                     │
│     time_accumulator += Time.delta_time                 │
├─────────────────────────────────────────────────────────┤
│ 5.  before_update phase                                 │
│     ├─ target_application.before_update()               │
│     └─ TransitionManager.before_update()                │
├─────────────────────────────────────────────────────────┤
│ 6.  Fixed-timestep loop                                 │
│     while (time_accumulator > Time.fixed_delta_time):   │
│       ├─ target_application.fixed_update()              │
│       ├─ TransitionManager.fixed_update()               │
│       └─ time_accumulator -= Time.fixed_delta_time      │
├─────────────────────────────────────────────────────────┤
│ 7.  Frame interpolation                                 │
│     Time.__set_frame_interpolation(                     │
│       time_accumulator / Time.fixed_delta_time          │
│     )                                                   │
├─────────────────────────────────────────────────────────┤
│ 8.  Variable update phase                               │
│     ├─ target_application.update()                      │
│     ├─ TransitionManager.update()                       │
│     ├─ ViewManager.update()                             │
│     └─ ViewComponentManager.update()                    │
├─────────────────────────────────────────────────────────┤
│ 9.  Render phase                                        │
│     ├─ target_application.on_pre_render()               │
│     ├─ graphics.update()          ← main scene render   │
│     └─ target_application.on_post_render()              │
├─────────────────────────────────────────────────────────┤
│ 10. Debug render                                        │
│     Debug.render(graphics)        ← debug overlay       │
├─────────────────────────────────────────────────────────┤
│ 11. Frame end                                           │
│     ├─ target_application.on_frame_end()                │
│     ├─ frames_passed++                                  │
│     ├─ input.clear()                                    │
│     └─ Debug.clear()                                    │
└─────────────────────────────────────────────────────────┘
```

## Fixed Timestep

The loop implements a **fixed-timestep pattern** to decouple physics/logic updates from the variable frame rate:

- `Time.fixed_delta_time` defines the fixed step interval (default: 1/30 s).
- Each frame, the elapsed delta is added to `time_accumulator`.
- The `fixed_update()` method runs as many times as needed to consume the accumulated time.
- After the fixed-update loop, `Time.frame_interpolation` is set to the leftover fraction (`time_accumulator / fixed_delta_time`), which can be used to interpolate visual state between fixed steps for smoother rendering.

## BaseApplication Lifecycle Hooks

The `RenderLoop` calls the following hooks on `target_application`. Override them in a `BaseApplication` subclass to implement application behavior.

| Hook | When called | Frequency |
|------|-------------|-----------|
| `on_enter(loop)` | On the first `start()` call, or when switching states via `set_state()`. | Once per state entry |
| `on_post_start()` | On the second frame (`frames_passed === 1`). | Once |
| `before_update()` | Every frame, before fixed updates. | Every frame |
| `fixed_update()` | Inside the fixed-timestep loop. | 0–N times per frame |
| `update()` | Every frame, after fixed updates. | Every frame |
| `on_pre_render()` | Immediately before `graphics.update()`. | Every frame |
| `on_post_render()` | Immediately after `graphics.update()`. | Every frame |
| `on_frame_end()` | At the very end of the frame. | Every frame |
| `on_exit(loop)` | When `stop()` is called, or when switching away via `set_state()`. | Once per state exit |

## Dependencies

| System | Role in the frame |
|--------|-------------------|
| **Time** | Singleton. Updated first; provides `delta_time`, `fixed_delta_time`, `smooth_delta_time`, and `frame_interpolation`. |
| **Input** | Updated early to capture current-frame events; cleared at frame end to reset one-shot press/release flags. |
| **TransitionManager** | Singleton. Manages animated transitions between view states. Participates in `before_update`, `fixed_update`, and `update` phases. |
| **ViewManager** | Singleton. Manages application views/pages. Updated after variable update to blend view opacities. |
| **ViewComponentManager** | Singleton. Manages UI components. Updated last in the update phase to refresh enabled components. |
| **Graphics** | Performs the actual scene render via its current render mode. Also exposes `_renderer.setAnimationLoop` used by `start()`/`stop()`. |
| **Debug** | Singleton. Renders a debug overlay after the main scene. Cleared at frame end. |
