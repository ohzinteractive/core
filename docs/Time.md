# Time

A singleton that manages all timing information for the application. It tracks elapsed time, per-frame delta time, a smoothed delta time (averaged over the last 10 frames), and a frame interpolation factor used by the fixed-timestep loop.

## Singleton Export

```ts
import { Time } from './Time';
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `fixed_delta_time` | `number` | `1/30` (≈0.0333 s) | The fixed timestep interval in seconds. Used by `RenderLoop` to drive `fixed_update()` calls. Can be changed to adjust the fixed update rate. |

## Getters

| Getter | Shorthand | Type | Description |
|--------|-----------|------|-------------|
| `delta_time` | `dt` | `number` | Time elapsed since the previous frame, in seconds. |
| `smooth_delta_time` | `sdt` | `number` | Rolling average of `delta_time` over the last 10 frames. Useful for stable UI display (e.g., FPS counters) or smoothing time-dependent effects. |
| `elapsed_time` | — | `number` | Total time elapsed since the application started, in seconds. |
| `frame_interpolation` | — | `number` | A value in the range [0, 1) representing how far the current frame is between two fixed-timestep ticks. Used to interpolate visual state for smoother rendering at variable frame rates. |
| `fixed_delta_time` | `fdt` | `number` | The fixed timestep interval (also accessible directly as a property). |

## Internal Methods

These are called by `RenderLoop` and `Initializer` and are not intended for application code.

### `init()`

Resets all timing state to initial values. Called once during application startup by `Initializer`.

### `__update(elapsed_time: number)`

Called once per frame by `RenderLoop` as the very first step. The `elapsed_time` parameter is in **milliseconds** (provided by the renderer's animation loop).

Internally it:

1. Computes `delta_time` as `(elapsed_time - previous_elapsed_time) / 1000` (converted to seconds).
2. Sets `elapsed_time` to `elapsed_time / 1000`.
3. Pushes the new delta into a 10-element rolling buffer (clamping outliers above 320 ms down to 32 ms to avoid spikes from tab-switches or debugger pauses).
4. Recalculates `smooth_delta_time` as the average of the buffer.
5. On the very first call, skips the delta calculation by detecting `previous_elapsed_time < 0`.

### `__set_frame_interpolation(value: number)`

Called by `RenderLoop` after the fixed-timestep loop. Sets `frame_interpolation` to `time_accumulator / fixed_delta_time`, representing the leftover fractional step.

## Delta Smoothing

The smooth delta is computed from a rolling buffer of the last 10 frame deltas:

```
smooth_delta_time = sum(delta_buffer) / 10
```

Frames with a delta ≥ 320 ms are recorded as 32 ms instead, preventing large hitches (e.g., from backgrounded tabs) from skewing the average.

## Lifecycle

```
Initializer.init()
  └─ Time.init()                          ← reset state

Each frame (driven by RenderLoop):
  1. Time.__update(elapsed_time)           ← update deltas
  2. ... fixed_update loop ...
  3. Time.__set_frame_interpolation(t)     ← set interpolation factor
```
