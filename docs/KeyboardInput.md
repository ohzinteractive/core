# KeyboardInput

Tracks keyboard state with three per-key signals — **pressed** (single frame on key down), **down** (held), and **released** (single frame on key up). Keys must be registered before they can be tracked.

## Export

```ts
import { KeyboardInput } from './KeyboardInput';
```

Not a singleton — instantiated as needed.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `container` | `Element \| Document` | The DOM element listening for `keydown`/`keyup` events. |
| `keys` | `Record<string, KeyState>` | Map of registered key codes to their current state. |
| `ctrlz_pressed` | `boolean` | `true` for one frame when Ctrl+Z is pressed. |

Each `KeyState` has:

| Field | Type | Description |
|-------|------|-------------|
| `pressed` | `boolean` | `true` for one frame when the key is first pressed. |
| `down` | `boolean` | `true` while the key is held down. |
| `released` | `boolean` | `true` for one frame when the key is released. |
| `fired` | `boolean` | Internal flag to prevent re-triggering on key repeat. |

## Methods

### Setup

| Method | Description |
|--------|-------------|
| `init(container)` | Attaches `keydown`/`keyup` listeners to the given DOM element. Resets all state. |
| `register_key(key)` | Registers a key code (e.g., `"KeyA"`, `"Space"`) for tracking. Only registered keys are observed. |
| `unregister_key(key_name)` | Removes a key from tracking. |
| `dispose()` | Removes the `keydown`/`keyup` event listeners. |

### Querying (use these in update/fixed_update)

| Method | Returns | Description |
|--------|---------|-------------|
| `is_key_pressed(key_name)` | `boolean` | `true` only on the frame the key was first pressed down. |
| `is_key_down(key_name)` | `boolean` | `true` every frame while the key is held. |
| `is_key_released(key_name)` | `boolean` | `true` only on the frame the key was released. |

All return `false` for unregistered keys.

### Frame Lifecycle

| Method | Description |
|--------|-------------|
| `clear()` | Resets `pressed` and `released` flags on all keys, and resets `ctrlz_pressed`. Called at the end of each frame so one-shot signals last exactly one frame. |
| `release_keys()` | Forces all keys into the up state and resets `ctrlz_fired`. Useful when the window loses focus. |

## Key State Transitions

```
                  keydown                          keyup
  ┌───────────┐  ──────────►  ┌──────────────┐  ──────────►   ┌─────────────┐
  │ Idle      │               │ pressed=true │                │released=true│
  │ down=false│               │ down=true    │                │ down=false  │
  └───────────┘               └──────────────┘                └─────────────┘
                                    │                              │
                              clear() resets                 clear() resets
                              pressed=false                  released=false
                                    │                              │
                                    ▼                              ▼
                              ┌──────────────┐               ┌─────────┐
                              │ down=true    │               │ Idle    │
                              │ pressed=false│               └─────────┘
                              └──────────────┘
                              (subsequent frames
                               while key held)
```

## Usage

```ts
const keyboard = new KeyboardInput();
keyboard.init(document);
keyboard.register_key('KeyW');
keyboard.register_key('Space');

// In your update loop:
if (keyboard.is_key_pressed('Space'))  { /* jump start */ }
if (keyboard.is_key_down('KeyW'))      { /* move forward */ }
if (keyboard.is_key_released('Space')) { /* jump end */ }
```
