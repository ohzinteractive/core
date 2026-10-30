# CameraController

An orbital camera rig. The controller keeps a target point (`reference_position`), a rotation (`reference_rotation`, set from tilt and orientation angles) and a distance (`reference_zoom`). Each frame, a pluggable **state** reacts to input and changes those values, and a pluggable **movement mode** turns them into the camera transform. Use it when a scene's camera orbits, pans and zooms around a point, is framed on objects, or is animated by view transitions. It works with perspective and orthographic cameras.

## Export

```ts
import { CameraController } from './camera_controller/CameraController';
import { CameraMovementMode } from './camera_controller/movement_mode/CameraMovementMode';
import { ImmediateMode } from './camera_controller/movement_mode/ImmediateMode';
import { AbstractCameraState } from './camera_controller/states/common/AbstractCameraState';
import { CommonCameraState } from './camera_controller/states/common/CommonCameraState';
```

Not singletons — instantiated as needed. A scene usually owns one controller in `AbstractScene.camera_controller`, which is where the boilerplate's dev bridge looks for it.

## Update Flow

```
CameraController.update()           ← call it yourself, e.g. in the scene's update()
  │
  ├─ current_state.update(cc)       ← reads input, edits the reference values
  │     reference_position, reference_rotation, reference_zoom
  │
  ├─ current_mode.update(cc)        ← writes the camera transform
  │     ImmediateMode: rotation = reference_rotation
  │                    position = reference_position − forward × clamp(reference_zoom)
  │
  └─ update_normalized_zoom(min_zoom, max_zoom)
```

Nothing calls `update()` automatically, and the controller never touches `CameraManager.current`.

---

## CameraController

### Constructor

| Parameter | Description |
|-----------|-------------|
| `input` | The PIT `Input` instance. Stored in `input`; the controller does not read it itself. |

It starts idle (an `AbstractCameraState`), in an `ImmediateMode`, with no camera.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `camera` | `PerspectiveCamera \| OrthographicCamera` | The driven camera. Set with `set_camera()`. |
| `input` | `Input` | The input passed to the constructor. |
| `input_enabled` | `boolean` | Toggled by `enable()` / `disable()`. Only states that check it honour it; `CommonCameraState` does not. |
| `current_state` | `AbstractCameraState` | The active state. |
| `current_mode` | `CameraMovementMode` | The active movement mode. Defaults to an `ImmediateMode`. |
| `reference_position` | `Vector3` | The point the camera looks at. Defaults to the origin. |
| `reference_rotation` | `Quaternion` | The camera rotation. Set it through the rotation methods so the angles stay in sync. |
| `reference_zoom` | `number` | Distance from the camera to `reference_position`. Default `10`. `ImmediateMode` clamps it to `[min_zoom, max_zoom]`. |
| `min_zoom` / `max_zoom` | `number` | Distance range. Defaults `1` / `400`. |
| `normalized_zoom` | `number` | `1` at `min_zoom`, `0` at `max_zoom`. Recomputed from the camera distance on every `update()`. |
| `current_tilt` | `number` | Degrees, in (-180, 180]. Positive looks down. |
| `current_orientation` | `number` | Degrees, in [0, 360). Turns counterclockwise about +Y. |
| `current_azimuth` | `number` | Degrees. Stored only: no rotation uses it. |
| `camera_initial_pos` / `camera_initial_rot` | `Vector3` / `Quaternion` | Copies of the camera transform taken by `set_camera()`. |

`zoom`, `tilt`, `orientation`, `point_of_interest`, `raised_look_at_position` and `use_raised_look_at_direction` are set in the constructor but nothing reads them.

### Methods

#### Setup

| Method | Description |
|--------|-------------|
| `set_camera(camera)` | Sets the camera and stores a copy of its position and rotation. Does not copy its rotation into `reference_rotation`, so call `set_rotation()` or `set_quaternion()` before the first `update()`, or the camera snaps to tilt 0, orientation 0. |
| `set_state(state)` | Calls `on_exit` on the old state, then `on_enter` on the new one. |
| `set_idle()` | `set_state(new AbstractCameraState())`. |
| `set_mode(mode)` | Calls `on_exit` on the old mode, then `on_enter` on the new one. The default mode never got its `on_enter`. |
| `enable()` / `disable()` | Sets `input_enabled`. |
| `update()` | Updates the state, then the mode, then the normalized zoom. Call it once per frame. |

#### Rotation

Angles are in degrees. A rotation is `orientation` about +Y, then `tilt` about the local X axis.

| Method | Returns | Description |
|--------|---------|-------------|
| `set_rotation(tilt?, orientation?, azimuth?)` | `void` | Sets the angles. An omitted (`undefined` or `null`) angle keeps its value; `0` is a valid value. |
| `set_rotation_delta(tilt, orientation, azimuth?)` | `void` | Adds to the current tilt and orientation. |
| `set_quaternion(q)` | `void` | Copies `q` into `reference_rotation` and derives tilt and orientation from it. Exact for rotations without roll, such as those from `build_rotation()`. |
| `build_rotation(tilt, orientation)` | `Quaternion` | A new quaternion for these angles. Applies nothing. |
| `lerp_rotation(from_tilt, to_tilt, from_orientation, to_orientation, from_azimuth, to_azimuth, t)` | `void` | Slerps between the two rotations and applies the result. The azimuth arguments are ignored. |
| `lerp_tilt(from, to, t)` | `void` | `lerp_rotation` with the current orientation. |
| `lerp_orientation(from, to, t)` | `void` | `lerp_rotation` with the current tilt. |
| `lerp_quaternion(q, t)` | `void` | Slerps from `reference_rotation` towards `q`. |
| `lerp_azimuth(from, to, t)` | `void` | Empty. Does nothing. |
| `get_current_tilt()` / `get_current_orientation()` / `get_current_azimuth()` | `number` | The current angles. |

#### Translation

| Method | Description |
|--------|-------------|
| `translate_forward(amount)` | Moves `reference_position` along the camera's local +Z (backwards). Pass a negative amount to move forward. |
| `translate_right(amount)` | Moves `reference_position` along the camera's local +X. |

Both use `camera.quaternion`, the rotation applied on the last `update()`.

#### Zoom

| Method | Returns | Description |
|--------|---------|-------------|
| `set_normalized_zoom(zoom)` | `void` | Clamps `zoom` to [0, 1] and stores it. The next `update()` overwrites it, and nothing turns it into a distance. |
| `update_normalized_zoom(min_zoom, max_zoom)` | `void` | Maps the camera's distance to `reference_position` from 1 (at `min_zoom`) to 0 (at `max_zoom`), clamped. |
| `camera_is_zoomed_out()` | `boolean` | `normalized_zoom < 0.2`. |

#### Framing

These fit the view to a set of points for the current `reference_rotation`. With a perspective camera they change `reference_position` and `reference_zoom` (a distance). With an orthographic camera they set `camera.zoom` (and update its projection matrix), center `reference_position`, and set `reference_zoom` to a distance that keeps the points between the near and far planes. A `scale` / `zoom_scale` above 1 frames tighter; below 1 leaves a margin. The perspective fit uses `OScreen.aspect_ratio`.

| Method | Returns | Description |
|--------|---------|-------------|
| `focus_camera_on_points(points, zoom_scale = 1)` | `void` | Frames `points`. |
| `focus_on_bounding_box(box, scale = 1)` | `void` | Frames the eight corners of a `Box3`. |
| `focus_camera_on_sphere(sphere, debug)` | `void` | Centers on `sphere.center` at the zoom from `get_zoom_to_sphere()`. Takes anything with `center` and `radius`. `debug` is unused. |
| `fit_points(quaternion, points, zoom_scale = 1)` | `{ zoom, reference_position, camera_position }` | The framing for `quaternion`, without applying it. `zoom` is a distance for perspective and the camera zoom for orthographic. |
| `get_zoom_to_focus_on_points(points, scale)` | `number` | The zoom `focus_camera_on_points` would use: a distance for perspective, the camera zoom for orthographic. Leaves the controller unchanged. |
| `get_target_pos_to_focus_on_points(points, scale)` | `Vector3` | The `reference_position` it would use. Leaves the controller unchanged. |
| `get_zoom_to_sphere(sphere, debug)` | `number` | The distance (perspective) or camera zoom (orthographic) that fits the sphere both ways. |

#### Debug Helpers

| Method | Description |
|--------|-------------|
| `show_projected_points(points)` / `hide_projected_points()` | Shows one `projected_points` helper at each point, or hides them all. `projected_points` is never created: assign an array of `Points` first, or these throw. |
| `show_plane_projection(plane, size = 1)` | Sets up and shows `projection_plane_helper`, a `PlaneHelper` that is not added to any scene. |
| `show_sphere_projection(sphere)` | Places and shows `projection_sphere_helper`, which is never created: assign one first. |

---

## Movement Modes

### CameraMovementMode (base)

Turns the reference values into a camera transform. All hooks are empty; override what you need.

| Method | Description |
|--------|-------------|
| `on_enter(camera_controller)` | Called by `set_mode()` when the mode becomes active. |
| `on_exit(camera_controller)` | Called by `set_mode()` when the mode is replaced. |
| `update(camera_controller)` | Called by `CameraController.update()` after the state. |

### ImmediateMode

Applies the reference values on the same frame, with no smoothing. It is the default mode.

| Method | Returns | Description |
|--------|---------|-------------|
| `on_enter(cc)` | `void` | Copies `cc.camera.quaternion` into `cc.reference_rotation`. |
| `update(cc)` | `void` | Clamps `cc.reference_zoom` to `[min_zoom, max_zoom]` (it writes the clamped value back), copies `reference_rotation` to the camera and places it `reference_zoom` behind `reference_position`. |
| `get_target_camera_pos(cc)` | `Vector3` | Where `update()` would place the camera. Returns a reused vector: clone it to keep it. |

---

## Camera States

### AbstractCameraState (base)

The idle state. All methods are empty.

| Method | Description |
|--------|-------------|
| `on_enter(camera_controller)` / `on_exit(camera_controller)` | Called by `set_state()`. |
| `update(camera_controller)` | Called by `CameraController.update()` before the mode. |
| `lock_zoom()` / `unlock_zoom()` | Empty, and nothing calls them. |

### CommonCameraState

A base for input driven states. `update()` only tracks keys; a subclass calls the `__` helpers to act on them. The keyboard must track the keys (the boilerplate registers them in `KeyboardInputController`).

| Constructor parameter | Description |
|-----------------------|-------------|
| `input` | The PIT `Input` to read. |

| Property | Type | Description |
|----------|------|-------------|
| `input` | `Input` | The input read by the helpers. |
| `forward_dir` / `right_dir` / `y_dir` | `number` | Per frame move amounts set by W/S, A/D and Z/C (`±0.12`, `0` on release). |
| `azimuth_dir` | `number` | Set by Q/E (`±0.48`). Nothing reads it. |
| `shift_key` | `boolean` | `true` while left Shift is down. Nothing reads it. |
| `rotation_velocity` | `Vector2` | Drag rotation speed: `x` is orientation, `y` is tilt. |

| Method | Description |
|--------|-------------|
| `update(cc)` | Updates the key directions. Call `super.update(cc)` in subclasses. |
| `__move_camera(cc)` | Applies the WASD and Z/C directions (per frame, not scaled by delta time). Right mouse drag pans `reference_position` on the plane through it that faces `CameraManager.current`. |
| `__zoom_camera(cc)` | Adds `input.zoom_delta * 0.5` to `reference_zoom`. |
| `__rotate_camera(cc)` | One pointer left drag adds to `rotation_velocity`, which is applied with `set_rotation_delta()` and decays each frame. |
| `__show_camera_position(cc)` | Logs the target, angles, zoom and fov when the left mouse button is released. Useful for authoring camera positions. |

## Usage

```ts
class OrbitState extends CommonCameraState
{
  update(camera_controller: CameraController)
  {
    super.update(camera_controller);

    this.__move_camera(camera_controller);
    this.__zoom_camera(camera_controller);
    this.__rotate_camera(camera_controller);
  }
}

// In the scene's init():
this.camera_controller = new CameraController(Input);
this.camera_controller.set_camera(this.camera);
this.camera_controller.set_state(new OrbitState(Input));
this.camera_controller.min_zoom = 1;
this.camera_controller.max_zoom = 40;
this.camera_controller.reference_zoom = 10;
this.camera_controller.set_rotation(30, 45); // tilt, orientation

// Later, frame a loaded model:
this.camera_controller.focus_on_bounding_box(new Box3().setFromObject(model), 0.8);

// In the scene's update():
this.camera_controller.update();
```
