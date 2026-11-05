# CameraFitting

Helpers that compute how a camera should be placed or zoomed so a set of points, a box or a rectangle fills the view, without changing the camera's rotation. `CameraUtilities` is the entry point. It picks the right fitter for the camera type and also has picking and screen projection helpers. The frustum point fitters do the math for perspective and orthographic cameras. Use them to frame a model or a selection, to pick a point on a plane under the mouse, or to pin HTML over a 3D object. For an orbiting camera rig that applies the framing for you, use `CameraController`, which uses the same fitters.

## Export

```ts
import { CameraUtilities } from './utilities/CameraUtilities';
import { PerspectiveFrustumPointFitter } from './utilities/PerspectiveFrustumPointFitter';
import { OrthographicFrustumPointFitter } from './utilities/OrthographicFrustumPointFitter';
import { FrustumPointFitter } from './utilities/FrustumPointFitter';
```

`CameraUtilities` is a singleton. The module exports one shared instance, and `Initializer.init(input)` calls `CameraUtilities.init(input)`. The fitters are not singletons — instantiated as needed. They keep no state between calls, apart from `PerspectiveFrustumPointFitter.sphere`.

## Fitting Flow

```
CameraUtilities.fit_points(camera, points, zoom_scale)
  │
  ├─ perspective camera
  │    PerspectiveFrustumPointFitter.fit_points(points, rotation, fov × zoom_scale, camera.aspect)
  │      → camera_position     where the first point touches the edge of the view
  │    reference_position      camera ray ∩ plane through the box center, facing the camera
  │    zoom                    distance from camera_position to reference_position
  │
  └─ orthographic camera
       OrthographicFrustumPointFitter.get_view_bounds(points, rotation)
       zoom                    get_zoom_to_fit_size(camera, size.x, size.y, zoom_scale)
       reference_position      bounds center
       camera_position         center + backward × get_distance_to_fit_depth(...)
                               (the current distance, if the depth fits the near and far planes)
```

Neither branch changes the camera. Apply the result yourself.

---

## CameraUtilities

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `input` | `Input` | The input passed to `init()`. Its `NDC` is the default mouse position in `get_plane_intersection()`. |
| `plane` | `Plane` | Scratch plane reused by `get_plane_intersection()`. |
| `ray` | `Ray` | Scratch ray reused by `get_plane_intersection()`. |

`tmp_mat`, `tmp_size` and `tmp_unproj` are created by `init()` but not used.

### Methods

A `camera` parameter falls back to `CameraManager.current` when it is `undefined`, except in `update_projection()`, `fit_points()` and `fit_bounding_box_points()`, where it is required. Every method that returns a vector returns a new one.

#### Setup

| Method | Description |
|--------|-------------|
| `init(input)` | Stores `input` and creates the scratch objects. Called by `Initializer.init()`. |
| `update_projection(camera)` | Sizes an orthographic camera to the canvas: `left`/`right`/`top`/`bottom` at ±`OScreen.width / 2` and ±`OScreen.height / 2` (one world unit per CSS pixel at zoom 1), sets `aspect` to `OScreen.aspect_ratio`, and updates the projection matrix. |

#### Directions

| Method | Returns | Description |
|--------|---------|-------------|
| `get_up_dir(camera)` | `Vector3` | The camera's +Y axis in world space. |
| `get_forward_dir(camera)` | `Vector3` | The camera's view direction (−Z) in world space. |
| `get_right_dir(camera)` | `Vector3` | The camera's +X axis in world space. |

#### Picking

| Method | Returns | Description |
|--------|---------|-------------|
| `unproject_mouse_position(NDC, camera)` | `Vector3` | The normalized world space direction from a perspective camera through `NDC`. Perspective cameras only: it reads `fov`, `aspect` and `far`. |
| `get_plane_intersection(plane_position, plane_normal, NDC?, camera?)` | `Vector3` | Where the ray under `NDC` (default `input.NDC`) hits the plane through `plane_position`. A falsy `plane_normal` uses the camera's forward direction. Works with perspective and orthographic cameras. Returns `(0, 0, 0)` when the ray misses the plane. |

#### Screen Positions

| Method | Returns | Description |
|--------|---------|-------------|
| `get_html_screen_pos(object, camera)` | `Vector3` | The object's world position in canvas pixels: `x` from the left, `y` from the top, sized by `OScreen.width` and `OScreen.height`. `z` keeps the NDC depth, outside −1..1 when the point is not between the near and far planes. |
| `world_pos_to_screen(pos, camera)` | `Vector3` | Same as `get_html_screen_pos()`, for a world position. |

#### Framing

`zoom` means a distance for a perspective camera and the camera's `zoom` for an orthographic camera.

| Method | Returns | Description |
|--------|---------|-------------|
| `fit_points(camera, points, zoom_scale = 1)` | `{ zoom, reference_position, camera_position }` | The framing of `points` for the camera's current rotation (see Fitting Flow). A `zoom_scale` above 1 frames tighter, below 1 leaves a margin. The perspective branch uses `camera.aspect`. |
| `fit_bounding_box_points(camera, bb, scale = 1)` | same as `fit_points()` | `fit_points()` on the 8 corners of `bb`. |
| `get_zoom_to_fit_box(bb, camera)` | `number` | `fit_bounding_box_points(camera, bb).zoom`. An empty box returns `0` for a perspective camera and the current `zoom` for an orthographic one. |
| `get_zoom_to_fit_rect(width, height)` | `number` | The zoom that fits a rectangle of half width `width` and half height `height` on `CameraManager.current`. |
| `fit_points_on_camera(points, zoom_scale = 1)` | `{ position, zoom }` | Flattens `points` onto the view plane of `CameraManager.current`. `position` is their center in world space, and `zoom` comes from `get_zoom_to_fit_rect()`. Here `zoom_scale` scales the area to fit, so a value above 1 leaves a margin, the opposite of `fit_points()`. |

---

## PerspectiveFrustumPointFitter

Finds the position from which a perspective camera, with a given rotation and field of view, sees all the points as close as possible.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `sphere` | `Sphere` | Bounding sphere of the points from the last `fit_points()` call. |

### Methods

#### Fitting

| Method | Returns | Description |
|--------|---------|-------------|
| `fit_points(points, camera_quaternion, vertical_fov, aspect)` | `Vector3` | The camera position. `vertical_fov` is the full vertical angle in degrees. |
| `get_distance_to_fit_rect(width, height, vertical_fov, aspect)` | `number` | The distance at which a rectangle of half width `width` and half height `height` fills the view: the larger of `width / tan(h_fov / 2)` and `height / tan(v_fov / 2)`. |

#### Steps of `fit_points()`

Public, but mostly useful inside `fit_points()`. The plane normal helpers take half the field of view, in radians.

| Method | Returns | Description |
|--------|---------|-------------|
| `get_up_plane_normal(camera_quaternion, v_fov)` | `Vector3` | Inward normal of the top side of the frustum. |
| `get_down_plane_normal(camera_quaternion, v_fov)` | `Vector3` | Inward normal of the bottom side. |
| `get_left_plane_normal(camera_quaternion, h_fov)` | `Vector3` | Inward normal of the left side. |
| `get_right_plane_normal(camera_quaternion, h_fov)` | `Vector3` | Inward normal of the right side. |
| `get_vertical_correction(points, down_plane, up_plane, camera_quaternion)` | `Vector3` | Offset along the camera's up axis that leaves the same margin between the points and the top and bottom planes. |
| `get_horizontal_correction(points, left_plane, right_plane, camera_quaternion)` | `Vector3` | The same along the camera's right axis. |
| `apply_center_correction_to_pos(target_pos, points, camera_quaternion, up_plane, down_plane, left_plane, right_plane)` | `void` | Adds both corrections to `target_pos`. |

### How `fit_points()` Works

1. Takes the bounding sphere of the points, and starts behind its center at `get_distance_to_fit_rect(2r, 2r, ...)`, far enough to see the whole sphere.
2. Builds the four side planes of the frustum through that position.
3. Moves the position across the view so the points are centered between the top and bottom planes and between the left and right planes.
4. Moves it forward along the view direction until the first point touches a side plane, and returns that position.

The near plane is not taken into account. It logs `'... intersection not found'` to the console when a plane intersection falls within 0.0001 of the world origin, which is also where a missed intersection ends up.

---

## OrthographicFrustumPointFitter

Math for orthographic cameras, which frame through `zoom` instead of distance. No constructor parameters and no properties.

| Method | Returns | Description |
|--------|---------|-------------|
| `get_view_bounds(points, camera_quaternion)` | `{ center, size }` | Bounds of the points as a camera with this rotation sees them. `center` is in world space. `size` is measured along the camera's right (`x`), up (`y`) and view (`z`) axes. A size below `1e-9` × the largest size is rounded noise and becomes `0`. |
| `get_zoom_to_fit_size(camera, width, height, scale = 1)` | `number` | The camera zoom that shows a `width` × `height` area, times `scale`. A size of `0` on one axis is ignored. If both are `0`, it returns the current `zoom` without scaling it. |
| `get_distance_to_fit_depth(camera, half_depth, preferred_distance)` | `number` | A distance from the center that keeps a depth of ±`half_depth` between the near and far planes. Keeps `preferred_distance` when it does. If no distance does, the near plane wins. |
| `get_distance_to_fit_rect(width, height, vertical_fov, aspect)` | `number` | Same formula as in `PerspectiveFrustumPointFitter` (half sizes, perspective field of view). |
| `fit_points(points, camera_quaternion, vertical_fov, aspect)` | `{ center, distance_to_center }` | `center` from `get_view_bounds()`, and the distance a perspective camera with `vertical_fov` would need. Not used by core. For an orthographic camera, use `get_view_bounds()` and `get_zoom_to_fit_size()`. |

---

## FrustumPointFitter

An older copy of `PerspectiveFrustumPointFitter`, with the same `sphere` property and `fit_points()` result. Nothing in core uses or extends it. Use `PerspectiveFrustumPointFitter` instead. The differences:

- Its horizontal correction is spelled `get_hozirontal_correction`.
- Every `fit_points()` call logs the closest points to the console twice.

---

## Usage

```ts
// Frame a model with the current camera, keeping its rotation
const camera = CameraManager.current;
const box = new Box3().setFromObject(model);
const fit = CameraUtilities.fit_bounding_box_points(camera, box, 0.9);   // 0.9 leaves a margin

camera.position.copy(fit.camera_position);

// Same framing with an orthographic camera: also apply the zoom
const ortho_fit = CameraUtilities.fit_bounding_box_points(ortho_camera, box, 0.9);
ortho_camera.position.copy(ortho_fit.camera_position);
ortho_camera.zoom = ortho_fit.zoom;
ortho_camera.updateProjectionMatrix();

// Each frame: the point under the mouse on the ground (y = 0)
const ground_point = CameraUtilities.get_plane_intersection(new Vector3(0, 0, 0), new Vector3(0, 1, 0));

// Pin an HTML label over an object
const pos = CameraUtilities.get_html_screen_pos(model, camera);
label.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
```
