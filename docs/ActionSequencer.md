# ActionSequencer

Animates the numeric keys of a plain context object on a timeline, and fires method calls at set times. Each key is a channel of keyframes, and each keyframe holds an interpolator that eases the key between two values over a time range in seconds. View transitions are built on it: `TransitionTable` turns each transition's data into a sequencer through `ActionSequencerBuilder` (see [Views](Views.md)). Use it directly for scripted, timeline driven animations that are not view transitions.

## Export

```ts
import { ActionSequencer } from './action_sequencer/ActionSequencer';
import { ActionEvent } from './action_sequencer/ActionEvent';
import { ActionInterpolator } from './action_sequencer/ActionInterpolator';
import { NumberInterpolator } from './action_sequencer/NumberInterpolator';
import { VectorInterpolator } from './action_sequencer/VectorInterpolator';
import { ActionSequencerBuilder } from './view_components/transition/ActionSequencerBuilder';
import { DrawIOAnimationSheet } from './view_components/transition/DrawIOAnimationSheet';
```

Not singletons — instantiated as needed.

## Flow

```
transition data (json)                  draw.io xml
        │                                   │
        │                     DrawIOAnimationSheet.parse()
        ▼                                   ▼
ActionSequencerBuilder.from_animation_sheet()   ActionSequencerBuilder.from_draw_io()
        │   one NumberInterpolator per track, one ActionEvent per trigger
        ▼
new ActionSequencer(context)
        │
  ┌─ update(delta_time) ── every frame while playing ─────────────────────┐
  │  elapsed_time += delta_time * playback_speed                           │
  │  fires each ActionEvent whose trigger_time was crossed                 │
  │  writes every channel's value into context[key]                        │
  └────────────────────────────────────────────────────────────────────────┘
        │
  is_finished() → elapsed_time > duration
```

---

## ActionSequencer

### Constructor

| Parameter | Description |
|-----------|-------------|
| `context` | The object to animate. Defaults to `{}`. One empty channel is created per key, and a JSON copy is kept as `initial_context`. |

**Every key of `context` needs at least one keyframe** before the first `update()`, `skip()` or `set_progress()`, or those calls throw. A keyframe for a key that is not in `context` also throws. The sequencer starts playing, at a time just below `0`.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `context` | `any` | The animated object. Its values are overwritten every time the sequencer plays. |
| `initial_context` | `any` | JSON copy of `context` at construction. Its keys are the channels that get played. |
| `channels` | `{ [key: string]: any[] }` | Keyframes per key, each `{ from, to, interpolator }`, in the order they were added. |
| `action_events` | `{ action: ActionEvent, trigger_time: number }[]` | The scheduled events. |
| `duration` | `number` | The latest keyframe end or event time, in seconds. |
| `elapsed_time` | `number` | Current time in seconds. |
| `previous_elapsed_time` | `number` | Time before the last advance. |
| `playback_speed` | `number` | Multiplier on `delta_time`. Read from the `?transitions_velocity=` URL parameter, `1` without it. |
| `playing` | `boolean` | `update()` only advances while `true`. Starts `true`. |

### Methods

#### Building

| Method | Description |
|--------|-------------|
| `add_action_interpolator(from, to, interpolator, use_dynamic_from_value?)` | Adds a keyframe to the `interpolator.attribute_name` channel, active from `from` to `to` seconds. With `use_dynamic_from_value = true`, the interpolator's `from` value is replaced by the previous keyframe's `to` value, or by `initial_context[key]` for the first keyframe. Extends `duration`. |
| `add_action_event(trigger_time, action)` | Schedules an `ActionEvent` at `trigger_time` seconds. Extends `duration`. |

Keyframes in one channel must be added in time order, and should not overlap.

#### Playback

| Method | Description |
|--------|-------------|
| `update(delta_time)` | If playing, advances `elapsed_time` by `delta_time * playback_speed`, fires the events between the previous and new time (inclusive), and writes every channel into `context`. |
| `play()` / `stop()` | Sets `playing`. |
| `reset()` | Moves `elapsed_time` back to just below `0`. Writes nothing until the next update. |
| `skip()` | Jumps to `duration`. Values are written at the current time; the next `update()` writes the final ones. Events between the current time and the end never fire. |

`update()` writes each value at the **previous** time, so values trail by one frame. When `is_finished()` turns `true`, call `update()` once more (as the transition system does) or `set_progress(duration)` to land on the final values.

#### Seeking & Progress

| Method | Returns | Description |
|--------|---------|-------------|
| `set_progress(time)` | — | Seeks to `time` seconds, clamped to `[0, duration]`, and writes the values there. Fires the crossed events when seeking forward. |
| `set_normalized_progress(t)` | — | Same as `set_progress(t * duration)`, with `t` clamped to 0–1. |
| `get_progress()` | `number` | `elapsed_time / duration`, clamped to 0–1. |
| `get_duration()` | `number` | `duration`. |
| `is_finished()` | `boolean` | `true` once `elapsed_time` passes `duration`. |

#### Channel Queries

These look at the channel's current keyframe: the one containing `elapsed_time`, else the one whose end is closest. The app's `CommonTransitionController` uses them to drive the camera.

| Method | Returns | Description |
|--------|---------|-------------|
| `get_current_starting_value(name)` | `number` | The keyframe's start value. |
| `get_current_target_value(name)` | `number` | The keyframe's end value, or its start value if the keyframe has not started yet. |
| `get_current_progress(name)` | `number` | The eased 0–1 progress through the keyframe. |
| `get_keyframes(name)` | `any[]` | The channel's keyframes. |
| `evaluate_keyframe(keyframe, time)` | `number` | The keyframe's value at `time` seconds. |
| `is_channel_redefined(name)` | `boolean` | `true` if no keyframe in the channel is an `initial` one, i.e. the transition data animates this key instead of returning it to its default. |

#### Channel Overrides

| Method | Description |
|--------|-------------|
| `set_initial_value_on_channel(name, value)` | Sets the start value of the channel's first keyframe. |
| `set_final_value_on_channel(name, value)` | Sets the end value of the channel's last keyframe. |

---

## Interpolators

A keyframe's interpolator eases one key between `from` and `to`. The sequencer calls `interpolator.evaluate(t)` with `t` in 0–1 and writes the result into the context.

### ActionInterpolator (base)

| Property / Method | Description |
|-------------------|-------------|
| `constructor(easing_function?)` | The name of an `EasingFunctions` method, such as `'linear'` (default), `'ease_in_out_cubic'` or `'ease_out_back'`. An unknown name leaves `easing_function` `undefined`, which throws when played. A function also works at runtime, although the type says `string`. |
| `attribute_name` | The context key to animate. `''` by default. |
| `easing_function` | `(t: number) => number`, resolved from the constructor argument. |
| `from` / `to` | `number \| Vector3`. `0` and `1` by default. |
| `update(context, t)` | Empty. Subclasses write `context[attribute_name]` at progress `t`. |

The base class has no `evaluate()`. A custom interpolator added to a sequencer must define `evaluate(t)` and return the value.

### NumberInterpolator

`new NumberInterpolator(attribute_name, from = 0, to = 1, initial = false, easing_function = 'linear')`

| Property / Method | Description |
|-------------------|-------------|
| `initial` | `true` for the tracks `ActionSequencerBuilder` adds to return keys to their defaults. Read by `is_channel_redefined()`. |
| `evaluate(t)` | Returns `lerp(from, to, easing_function(t))`. |
| `update(context, t)` | Writes `evaluate(t)` into `context[attribute_name]`. |

### VectorInterpolator

`new VectorInterpolator(attribute_name, from = new Vector3(), to = new Vector3(1, 1, 1), easing_function = 'linear')`

| Method | Description |
|--------|-------------|
| `update(context, t)` | Lerps `from` to `to` and copies the result into the `Vector3` at `context[attribute_name]`. Allocates a `Vector3` per call. |

It has **no `evaluate()`**, so an `ActionSequencer` cannot play it. Call `update()` yourself.

---

## ActionEvent

A method call on a named object of the running app.

| Property / Method | Description |
|-------------------|-------------|
| `constructor(name, method, args?)` | `name` is a key of `window.ViewApi.application`, `method` a method on it. `args` is a comma separated string. |
| `trigger()` | Calls `ViewApi.application[name][method](...args.split(','))`. Every argument arrives as a string. |

`args` is optional in the signature, but `trigger()` throws without it. Pass `''` for a method without arguments (it then receives one `''` argument). `window.ViewApi` is set by the boilerplate's `Api.ts`.

---

## ActionSequencerBuilder

Builds a sequencer from transition data. `TransitionTable.get()` creates one per transition with the default state data.

| Property / Method | Returns | Description |
|-------------------|---------|-------------|
| `constructor(default_state_data)` | — | The default values of every state key. |
| `default_state_data` | `object` | As passed. |
| `from_animation_sheet(animation_data, current_context)` | `ActionSequencer` | Creates a sequencer over `current_context`. Every key of `default_state_data` that no track animates gets an `initial` track back to its default value. Then adds one `NumberInterpolator` per track, starting from the key's current value (`use_dynamic_from_value`), and one `ActionEvent` per trigger. |
| `from_draw_io(xml, context)` | `ActionSequencer` | Parses `xml` with `DrawIOAnimationSheet` and builds the same way, with no default tracks, so the sheet must animate every key of `context`. |
| `state_to_tracks(state, longest_time)` | `object[]` | One `initial` track per key of `state`, from `0` to `min(longest_time, 1)` seconds, with `ease_in_out_cubic`. |
| `get_longest_time(tracks)` | `number` | The largest `to_time`, or `-1` for no tracks. |

`from_animation_sheet()` also accepts a third `initial_context` argument, which it ignores. It pushes the default tracks into `animation_data.animation_tracks`, so it **mutates the data it receives**. Later calls reuse those tracks, even after `default_state_data` changes. Tracks for one key must be listed in time order. The data format is described in [Views → Transition Data](Views.md#transition-data).

---

## DrawIOAnimationSheet

Reads a timeline drawn in [draw.io](https://www.drawio.com/) and returns transition data. 100 px on the x axis is one second.

| Method | Returns | Description |
|--------|---------|-------------|
| `parse(xml_document)` | `{ animation_tracks, triggers }` | Parses an uncompressed draw.io XML string with `DOMParser`. Tracks are sorted by `from_time`. |
| `get_node_x_position(node)` | `number` | An `mxGeometry` element's `x`, or `0` when it has none. |

- **Track**: a square cornered rectangle (style has `rounded=0;`, not `text;`) labelled `key=value--easing`, such as `home_opacity=1--ease_in_out_cubic`. The easing is required. It runs from its left edge to its right edge. Rectangle labels that are empty or contain a space are ignored.
- **Trigger**: a rhombus labelled `name.method`, fired at its horizontal center. Triggers carry no `args`, so the events `from_draw_io()` builds throw when they fire (see [ActionEvent](#actionevent)).

---

## Usage

```ts
import { ActionEvent, ActionSequencer, NumberInterpolator, Time } from 'ohzi-core';

const state = { logo_opacity: 0, logo_scale: 0.8 };
const intro = new ActionSequencer(state);

intro.add_action_interpolator(0, 0.6, new NumberInterpolator('logo_opacity', 0, 1, false, 'ease_out_cubic'));
intro.add_action_interpolator(2, 2.5, new NumberInterpolator('logo_opacity', 0, 0), true); // from 1, the previous end
intro.add_action_interpolator(0, 1, new NumberInterpolator('logo_scale', 0.8, 1, false, 'ease_out_back'));

// Calls window.ViewApi.application.home_view.show_menu('fast') at 1 s
intro.add_action_event(1, new ActionEvent('home_view', 'show_menu', 'fast'));

// Every frame
intro.update(Time.delta_time);
logo.style.opacity = String(state.logo_opacity);
logo.style.transform = `scale(${state.logo_scale})`;
```
