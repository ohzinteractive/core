# Views

The view layer splits the app into named, URL addressable views. Each view owns a DOM container. Moving between views plays an animated transition that interpolates a shared bag of numbers, the state data, such as `home_opacity`. Each view and view component reads its own `<name>_opacity` key from it. Extend `ApplicationView` for each page or section and navigate with `ViewManager`. Extend `ViewComponent` for UI that shows and hides with the state data. `TransitionManager` and `TransitionTable` run the transitions.

## Export

```ts
import { ApplicationView } from './view_components/ApplicationView';
import { ViewComponent } from './view_components/ViewComponent';
import { ViewManager } from './view_components/ViewManager';
import { ViewComponentManager } from './view_components/ViewComponentManager';
import { TransitionManager } from './view_components/TransitionManager';
import { TransitionTable } from './view_components/transition/TransitionTable';
```

`ViewManager`, `ViewComponentManager` and `TransitionManager` are singletons, created when the module loads. `Initializer` does not touch them. `ApplicationView` and `ViewComponent` are base classes to extend. `TransitionTable` is not a singleton, but `TransitionManager.transition_table` is the only instance core uses.

## Transition Flow

`RenderLoop` calls `TransitionManager.before_update()`, `fixed_update()` and `update()` every frame, then `ViewManager.update()` and `ViewComponentManager.update()` after the app's `update()`. You never call them yourself.

```
ViewManager.go_to_view('about')
  ├─ change_url? → history.pushState(url), document.title
  └─ TransitionManager.go_to_state(about, skip)
       ├─ already transitioning? → previous last view's on_exit()
       ├─ last = current, current = about
       ├─ last.before_exit()
       ├─ about.before_enter()
       └─ TransitionTable.get(last.name, 'about', state data) → new ActionSequencer

  ┌─ TransitionManager.update() ─── every frame while transitioning ───────┐
  │  sequencer.update(Time.delta_time)        ← writes into state data     │
  │  last.update_exit_transition(state data, progress, sequencer)          │
  │  about.update_enter_transition(state data, progress, sequencer)        │
  │  sequencer finished?                                                   │
  │    ├─ yes → last.on_exit(), then about.on_enter()                      │
  │    └─ no  → continue next frame                                        │
  └────────────────────────────────────────────────────────────────────────┘
```

Then `about.update()` runs every frame until the next `go_to_state()`. It does not run during a transition, but `before_update()` and `fixed_update()` keep running for the current view. With `skip = true` the sequencer jumps to its end and the transition completes in the same call.

---

## ApplicationView

Base class for a view. It extends `ViewState` (not exported), which declares the empty lifecycle hooks. The constructor registers the view with `ViewManager` and adds a `{ to: name, data: transition_data }` entry to the transition table.

### Constructor

| Parameter | Description |
|-----------|-------------|
| `name` | Unique view name. Also the state data prefix: the view reads `<name>_opacity`. |
| `url` | URL path used by `go_to_view()` and `ViewManager.get_by_url()`. |
| `container` | The view's root `HTMLElement`. |
| `transition_data` | Optional. Transition data played when entering this view (see [Transition Data](#transition-data)). Defaults to empty tracks and triggers. |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | View name. |
| `url` | `string` | View URL path. |
| `container` | `HTMLElement` | Root element. Its classes and opacity are managed by the view. |
| `current_opacity` | `number` | Last opacity written to `container.style.opacity`. Starts at `0`. |

### Methods

Override the lifecycle hooks, and call `super` in those that manage classes:

| Method | When called |
|--------|-------------|
| `start()` | Never by core. Empty; the app calls it once at startup. |
| `before_enter()` | Transition into this view starts. Adds `before_enter`, removes `before_exit` and `hidden`. |
| `on_enter()` | Transition into this view finished. Removes `before_enter`, `before_exit` and `hidden`. |
| `before_exit()` | Transition out of this view starts. Adds `before_exit`, removes `before_enter` and `hidden`. |
| `on_exit()` | Transition out of this view finished, or was interrupted by another `go_to_state()`. Adds `hidden`, removes the other two. |
| `before_update()` / `fixed_update()` | Every frame / every fixed step while this is the current view. |
| `update()` | Every frame while this is the current view and no transition runs. |
| `update_enter_transition(state_data, progress, action_sequencer)` | Every frame while transitioning into this view. `progress` is 0–1. |
| `update_exit_transition(state_data, progress, action_sequencer)` | Every frame while transitioning out of this view. |
| `set_opacity(state_data)` | Every frame, from `ViewManager.update()`. Writes `state_data[<name>_opacity]` to `container.style.opacity` when it changed. |

---

## ViewManager

Singleton registry of views. Navigates between them and keeps the browser URL and title in sync.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `views` | `ApplicationView[]` | Registered views, in registration order. |
| `browser_title_suffix` | `string` | Appended to `document.title` on navigation. Defaults to `''`. |

### Methods

#### Navigation

| Method | Description |
|--------|-------------|
| `go_to_view(view_name, change_url = true, skip = false)` | Transitions to the named view. With `change_url`, pushes the view's URL to the history and sets `document.title` to the URL, uppercased without its first `/` and with `-`/`_` turned into spaces, plus ` \| <suffix>`. The root URL `/` leaves only the suffix. Throws if no view has that name. |
| `go_to_scene(view_name, change_url = false, skip = false)` | Requires a registered view named `'transition'` with a `set_next_view(view)` method. Hands it the named view and goes to `'transition'`, which loads the next view in between. |
| `set_view(view_name)` | Makes the view current immediately, with no transition and no lifecycle hooks. |
| `set_browser_title_suffix(title_suffix)` | Sets `browser_title_suffix`. |

#### Lookup

| Method | Returns | Description |
|--------|---------|-------------|
| `get(view_name)` | `ApplicationView \| undefined` | The view with that name. Logs an error when missing. |
| `get_by_url(url)` | `ApplicationView \| undefined` | The view with that exact URL. Logs an error when missing. |
| `has_view(view_name)` | `boolean` | Whether a view with that name is registered. |
| `get_current_view()` | `ViewState` | `TransitionManager.get_current_state()`. Before the first navigation, a placeholder named `'current_initial'`. |
| `get_view_by_name(view_name)` | `undefined` | **Deprecated.** Warns and returns nothing. Use `get()`. |

`register_view(view)` is called by the `ApplicationView` constructor. `update()` is called by `RenderLoop` and calls `set_opacity()` on every view.

---

## TransitionManager

Singleton that holds the current view, the state data and the running transition. It delegates to an internal `ViewStateTransitionHandler` and a `TransitionTable`.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `transition_table` | `TransitionTable` | Where transition data is stored and looked up. |
| `transition_handler` | `ViewStateTransitionHandler` | Internal. Runs the flow shown in [Transition Flow](#transition-flow). |

### Computed Properties

| Property | Type | Description |
|----------|------|-------------|
| `current_state_data` | `Record<string, any>` | The live state data. While a transition runs, its sequencer overwrites every key each frame. A value you write between transitions stays until the next one. Write only keys that are in the defaults: a key missing from them makes the next transition throw. |
| `action_sequencer` | `ActionSequencer` | The sequencer of the current or last transition. `undefined` before the first one. |

### Methods

| Method | Description |
|--------|-------------|
| `set_default_state_data(data)` | Merges `data` into the defaults and into `current_state_data`. Call it once at startup, before the first transition. Every key a transition animates must be in here. |
| `go_to_state(state, skip = false)` | Starts a transition to `state`. `ViewManager.go_to_view()` calls this. |
| `set_state(state)` | Sets the current state without a transition or hooks. |
| `get_current_state()` | Returns the current state. |
| `add_transitions(transitions)` | Appends entries to the transition table. |
| `set_transitions(transitions)` | Replaces the whole table, including the entries each `ApplicationView` registered. |
| `before_update()` / `update()` / `fixed_update()` | Called by `RenderLoop`. |

---

## TransitionTable

A list of transition entries, `{ from?: string, to: string, data }`, that builds an `ActionSequencer` for a pair of views.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `transitions` | `any[]` | The entries. |
| `default_state_data` | `object` | Values that keys not animated by an entry return to. |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `get(from_name, to_name, current_context)` | `ActionSequencer \| undefined` | Uses the first entry matching both `from` and `to`, else the first with that `to` and no `from`. Builds a sequencer that animates `current_context` from its current values. Logs an error and returns `undefined` when nothing matches. |
| `add_transitions(transitions)` | — | Appends entries. |
| `set_transitions(transitions)` | — | Replaces all entries. |
| `set_default_state_data(data)` | — | Replaces `default_state_data`. |

### Transition Data

The `data` of an entry, usually a json file per view:

```json
{
  "animation_tracks": [
    { "attribute_name": "home_opacity", "from_time": 0, "to_time": 1, "to_value": 1, "easing_function": "ease_in_out_cubic" }
  ],
  "triggers": [
    { "at_time": 0.5, "name": "home_view", "method": "play_intro", "args": "fast" }
  ]
}
```

- **Tracks** animate one key from its current value to `to_value` between `from_time` and `to_time`, in seconds. The `?transitions_velocity=` URL parameter scales the speed.
- **Every default key the entry does not animate** goes back to its default value over the first `min(longest track, 1)` seconds with `ease_in_out_cubic`. So entering `home` fades `home_opacity` in and every other `*_opacity` key back to its default `0`, without listing them.
- **Triggers** call `window.ViewApi.application[name][method](...args.split(','))` at `at_time`. `args` is required.

---

## ViewComponent & ViewComponentManager

`ViewComponent` is a base class for UI that is not a view: a modal, an overlay, a HUD. Its visibility follows `<name>_opacity` in the state data, whatever view is current. The constructor registers it with `ViewComponentManager`, and it starts hidden.

### Constructor

| Parameter | Description |
|-----------|-------------|
| `name` | Component name. The component reads `<name>_opacity`. |
| `container` | The component's root `HTMLElement`. |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Component name. |
| `container` | `HTMLElement` | Root element. |
| `hidden` | `boolean` | `true` until the opacity goes above `0.001`. |

### Methods

| Method | Description |
|--------|-------------|
| `start()` | Empty. Not called by core. |
| `on_enter()` | Called when the opacity rises above `0.001`. Removes `hidden` from the container and enables the component. |
| `update(state_data)` | Called every frame while enabled. Override for per-frame work. |
| `on_exit()` | Called when the opacity drops to `0.001` or below. Adds `hidden` and disables the component. |
| `set_opacity(state_data)` | Writes `<name>_opacity` to `container.style.opacity`, then calls `toggle_hidden()`. |
| `toggle_hidden()` | Calls `on_enter()` or `on_exit()` when the visibility changes. |

`ViewComponentManager` is a singleton. Its `update()` runs every frame from `RenderLoop`: it calls `set_opacity()` on every component, then `update()` on the enabled ones.

| Member | Description |
|--------|-------------|
| `components` | Every registered `ViewComponent`. |
| `enabled_components` | `Set` of components between `on_enter()` and `on_exit()`. |
| `get(name)` | Returns the component with that name, or `undefined` and logs an error. |
| `register_component(c)` / `enable_component(c)` / `disable_component(c)` | Called by `ViewComponent`. |
| `get_component_by_name(name)` | **Deprecated.** Warns and returns nothing. Use `get()`. |

## Usage

```ts
TransitionManager.set_default_state_data({ home_opacity: 0, about_opacity: 0, menu_opacity: 0 });

class AboutView extends ApplicationView
{
  constructor()
  {
    super({ name: 'about', url: '/about', container: document.querySelector('.about'), transition_data: about_data });
  }

  update_enter_transition(state_data, progress)
  {
    this.container.style.transform = `translateY(${(1 - progress) * 40}px)`;
  }
}

const home = new HomeView();
new AboutView();
new ViewComponent({ name: 'menu', container: document.querySelector('.menu') });

ViewManager.set_browser_title_suffix('OHZI');
ViewManager.go_to_view(home.name, false, true); // first view, no URL change, no animation

// Later, from a click handler:
ViewManager.go_to_view('about'); // URL becomes /about, title "ABOUT | OHZI"

// Between transitions, a direct write shows the menu on the next frame
TransitionManager.current_state_data.menu_opacity = 1;
```
