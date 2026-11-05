# Utilities

Small helpers that the rest of core and the boilerplate build on: scalar, vector and color math, easing curves, geometry and scene graph helpers, array, object, string, time and validation helpers, DOM lazy loading, and a tween for one CSS property. Use them for a remap or an easing curve in an update loop, to post-process a loaded model (find an object, swap materials, clone a skinned GLTF), to scatter points over a mesh, or to fade a DOM element outside the view transition system (see [Views](Views.md)).

## Export

```ts
import { OMath } from './utilities/OMath';
import { EasingFunctions } from './utilities/EasingFunctions';
import { GeometryUtilities } from './utilities/GeometryUtilities';
import { MeshSampler } from './utilities/MeshSampler';
import { ModelUtilities } from './utilities/ModelUtilities';
import { ArrayUtilities } from './utilities/ArrayUtilities';
import { ObjectUtilities } from './utilities/ObjectUtilities';
import { StringUtilities } from './utilities/StringUtilities';
import { TimeUtilities } from './utilities/TimeUtilities';
import { Validation } from './utilities/Validation';
import { ImageUtilities } from './utilities/ImageUtilities';
import { HTMLUtilities } from './utilities/HTMLUtilities';
import { CSSAnimator } from './html_utilities/CSSAnimator';
```

Most of them only have static methods: call them on the class (`OMath.lerp(...)`). Three work differently:

| Export | Kind | Call it as |
|--------|------|------------|
| `MeshSampler`, `ModelUtilities` | Singletons. The module exports one shared instance. | `MeshSampler.sample(...)` |
| `TimeUtilities` | Class with an instance method | `new TimeUtilities().time_str_to_ms(...)` |
| `CSSAnimator` | Not a singleton — instantiated as needed. | `new CSSAnimator({ ... })` |

---

## OMath

Scalar, vector and color math.

### Ranges and Interpolation

| Method | Returns | Description |
|--------|---------|-------------|
| `lerp(x, y, t)` | `number` | `(1 - t) * x + t * y`. `t` is not clamped. |
| `linear_map(value, from_start, from_end, to_start, to_end)` | `number` | Remaps `value` from one range to the other. Not clamped. |
| `clamp(value, min, max)` | `number` | `value` limited to `min`–`max`. |
| `saturate(x)` | `number` | `clamp(x, 0, 1)`. |
| `between(value, min, max)` | `boolean` | `true` when `min <= value <= max`. |
| `pingpong(x, length = 1)` | `number` | Bounces between `0` and `length` as `x` grows: `0, 0.5, 1, 0.5, 0` for `x = 0, 0.5, 1, 1.5, 2`. |
| `mod(number, divisor)` | `number` | Modulo with the sign of the divisor: `mod(-1, 3)` is `2`. `euclideanModulo(n, m)` is the same function. |
| `equals(x1, x2)` | `boolean` | `true` when they differ by less than `0.000001`. |

### Angles, Vectors, Colors and IDs

| Method | Returns | Description |
|--------|---------|-------------|
| `deg_to_rad(degrees)` / `rad_to_deg(radians)` | `number` | Angle conversion. `degToRad` and `radToDeg` are camelCase copies. |
| `points_average(points)` | `Vector3` | Centroid of a non-empty `Vector3[]`, as a new vector. |
| `project_points_on_plane(points, plane)` | `Vector3[]` | New vectors: each point projected onto the `Plane`. |
| `matrix4_lerp(from, to, target, t)` | `void` | Lerps the 16 elements of two `Matrix4`s into `target`. Element by element, so in-between rotations are not pure rotations. |
| `perspective_divide(v)` | `v` | Divides `x`, `y` and `z` by `w` in place and returns `v`. |
| `rgb_to_hex(rgb)` | `string` | `{ r, g, b }` with 0–1 channels as strings: `{ r: '0.5', g: '1', b: '0' }` → `'#80ff00'`. Overwrites the input's fields with their hex digits. |
| `get_random_color()` | `string` | Random `'#rrggbb'`, lowercase. |
| `generate_uuid()` | `string` | Random version 4 UUID. Uses `Math.random()`, so it is not cryptographically secure. |

---

## EasingFunctions

Static curves that map progress `x` from 0–1 to an eased value, `0` at `x = 0` and `1` at `x = 1`. Each takes and returns one number. `ActionInterpolator` looks them up by name (`EasingFunctions[name]`), so these method names are also the easing strings in transition data (see [ActionSequencer](ActionSequencer.md)). `CSSAnimator` takes the function itself.

| Methods | Curve |
|---------|-------|
| `linear` | Returns `x`. |
| `ease_in_sine`, `ease_out_sine`, `ease_in_out_sine` | Sine, the gentlest. |
| `ease_in_quad`, `ease_out_quad`, `ease_in_out_quad` | Power 2. |
| `ease_in_cubic`, `ease_out_cubic`, `ease_in_out_cubic` | Power 3. |
| `ease_in_quart`, `ease_out_quart`, `ease_in_out_quart` | Power 4. |
| `ease_in_quint`, `ease_out_quint`, `ease_in_out_quint` | Power 5. |
| `ease_in_expo`, `ease_out_expo`, `ease_in_out_expo` | Exponential. |
| `ease_in_circ`, `ease_out_circ`, `ease_in_out_circ` | Quarter circle. `ease_in_circ` returns `NaN` past `x = 1`. |
| `ease_in_back`, `ease_out_back`, `ease_in_out_back` | Overshoots: dips below 0 or goes past 1 before it settles. |
| `ease_in_elastic`, `ease_out_elastic`, `ease_in_out_elastic` | Springs past the ends several times. |
| `ease_in_bounce`, `ease_out_bounce`, `ease_in_out_bounce` | Bounces at the start (`in`), the end (`out`) or both. |
| `triangular` | Not an ease: 0 → 1 → 0 over 0–1, repeating every 1. |
| `heartbeat` | Not an ease: a pulse that stays near 1 (0.90–1.03) and repeats every 2π in `t`. For looping effects. |

---

## Geometry and Models

### GeometryUtilities

Prepares geometry for shaders that draw triangle edges; `Grid` uses it.

| Method | Returns | Description |
|--------|---------|-------------|
| `convert_to_non_indexed_geometry(geometry)` | `BufferGeometry` | New non-indexed geometry with one vertex per triangle corner and a `barycentric` attribute. Copies `position` only: normals, UVs and groups are dropped. Needs an indexed geometry. |
| `add_barycentric_attribute(geometry)` | `void` | Adds a 3 component `barycentric` attribute (`1,0,0`, `0,1,0`, `0,0,1` per triangle) to a non-indexed geometry, in place. |

### MeshSampler

Singleton. Scatters random points over a mesh surface, weighted by triangle area.

| Method | Returns | Description |
|--------|---------|-------------|
| `sample(geometry, sample_count)` | `{ points, normals, tangents, uvs }` | Picks `sample_count` triangles (bigger ones more often) and a uniform random point in each, in the geometry's local space. `points` and `uvs` are interpolated at that point. `normals` and `tangents` are the triangle's averaged vertex values, flat per triangle. An array is empty when the geometry has no such attribute. |
| `sample_point_in_face(w1, w2, a, b, c)` | `Vector2 \| Vector3` | Point inside triangle `a b c` for two random weights in 0–1. Works for positions and UVs. |

- The geometry must be indexed: `sample` throws when `geometry.index` is `null`. `BufferGeometryUtils.mergeVertices()` adds an index.
- Each triangle goes into a pick list `round(area / smallest area)` times. A zero-area triangle makes that division infinite and the call never returns, and very uneven triangle sizes build a very long list.
- The steps `sample` runs (`get_face_area`, `get_uniform_face_distribution`, `select_random_faces`, `sample_data_from_faces`) are public, but they take a `Face` type that is not exported.

### ModelUtilities

Singleton. Scene graph helpers for loaded models. Each one walks the tree with `traverse()`, so it works on any `Object3D` (a GLTF `scene`, an `AbstractScene`), although some parameters are typed `AbstractScene`.

| Method | Returns | Description |
|--------|---------|-------------|
| `get_mesh(root, callback)` | `void` | Calls `callback(mesh)` for every `Mesh`, after replacing its `geometry` with a clone. |
| `get_geometries(root)` | `BufferGeometry[]` | Every mesh's geometry. Goes through `get_mesh`, so every mesh also gets a cloned geometry. |
| `assign_material(root, material, name)` | `void` | Sets `material` on the meshes called `name`, or on every `Mesh` when `name` is `undefined`. |
| `set_shadow_config(root, cast, receive)` | `void` | Sets `castShadow` and `receiveShadow` on every `Mesh`. |
| `get_object(root, name)` | `Object3D \| undefined` | The **last** object with that `name` in traversal order. Three's `getObjectByName()` returns the first. |
| `get_object_by_type(root, type)` | `Object3D \| undefined` | The last object whose `constructor.name` is `type` (for example `'SkinnedMesh'`). Minifiers can rename classes, so this can miss in production builds. |
| `clone_animated_gltf(gltf)` | `{ animations, scene }` | Deep clones `gltf.scene` and binds each cloned `SkinnedMesh` to a new `Skeleton` of the cloned bones, so the clone animates on its own. Matches skinned meshes and bones by `name`, so those must be unique. `animations` is shared, not cloned. |

---

## Data Helpers

### ArrayUtilities

All but the last two change the array in place.

| Method | Returns | Description |
|--------|---------|-------------|
| `merge_from_to(source, target)` | `void` | Appends every item of `source` to `target` with `push.apply`, which can overflow the call stack for very large arrays. |
| `remove_elem(array, elem)` | `void` | Removes the first `elem`, if there is one. |
| `expand_vec3_array(array, size)` | `void` | Grows a `Vector3[]` to `size` by appending clones of its items, cycling from the start. Throws on an empty array. |
| `get_closest_point(points, target)` | `Vector3` | The point nearest to `target` (that instance, not a copy). |
| `object_values_to_array(obj)` | `T[]` | Same as `Object.values(obj)`. |

### ObjectUtilities

| Method | Returns | Description |
|--------|---------|-------------|
| `is_object(item)` | `boolean` | Truthy for objects that are not arrays. For a falsy input it returns that input (`null`, `0`, `''`), not `false`. |
| `merge_deep(target, ...sources)` | `target` | Merges each source into `target` in order and returns `target`. Nested objects merge; arrays and other values replace (arrays by reference, not copied). |
| `xml_to_json(node)` | `object` | Converts a DOM XML node (for example from `DOMParser`): attributes go under `'@attributes'`, children under their `nodeName` (text under `'#text'`), and repeated names become arrays. |

### StringUtilities, TimeUtilities and Validation

| Method | Returns | Description |
|--------|---------|-------------|
| `StringUtilities.capitalize(string)` | `string` | Uppercases the first letter of every space separated word. Throws on an empty word (`''`, or two spaces in a row). |
| `StringUtilities.capitalize_first_letter(string)` | `string` | Uppercases the first character only. |
| `StringUtilities.snake_to_camelcase(string)` | `string` | Lowercases, then drops each `_` or `-` and uppercases the character after it: `'MY_VALUE'` → `'myValue'`. |
| `StringUtilities.get_random_color()` | `string` | Random `'#RRGGBB'`, uppercase. |
| `new TimeUtilities().time_str_to_ms(time_str)` | `number` | Parses `'hh:mm:ss'` into milliseconds; seconds can have decimals (`'00:01:30.5'` → `90500`). All three parts are required: `'01:30'` gives `NaN`. |
| `Validation.is_int(n)` | `boolean` | `true` for a `number` without a fractional part. Numeric strings are `false`. |
| `Validation.is_float(n)` | `boolean` | `true` for a `number` with a fractional part, and also for `Infinity`. |
| `Validation.is_number(n)` | `boolean` | `is_int(n) \|\| is_float(n)`: `false` for `NaN` and strings, `true` for `Infinity`. |
| `Validation.is_json(str)` | `boolean` | `true` when `JSON.parse` accepts it, including `'1'` and `'null'`. |

---

## DOM Helpers

### ImageUtilities

Reads pixels on the CPU, for example to place objects from a mask image.

| Method | Returns | Description |
|--------|---------|-------------|
| `get_image_data(image)` | `ImageData` | Draws `image` on a new canvas and reads its pixels back. Typed `ImageBitmap`; at runtime any `drawImage()` source with `width` and `height` works. |
| `get_pixel(imagedata, x, y)` | `Vector4` | RGBA at (`x`, `y`), 0–255 per channel, `y` from the top. No bounds check: an `x` past the width reads from the next row, and past the end of the data you get `(0, 0, 0, 1)`. |

### HTMLUtilities

Lazy loading: put the URL in `data-src` and call one of these when the content is about to show. Each copies `data-src` into the real attribute of the matching elements inside `container`, and skips elements without `data-src`.

| Method | Description |
|--------|-------------|
| `load_images(container)` | `<img>` (`src`) and `<object>` (`data`). |
| `load_videos(container)` | `<video>` `src`. `<source>` children are not covered. |
| `load_iframes(container)` | `<iframe>` `src`. |
| `load_elements(container, selector)` | `src` of any element matching `selector`, for example `'source'`. |

### CSSAnimator

Tweens one numeric style property of an element from `from` to `to`, eased, over `duration` seconds. Not a singleton — instantiated as needed. It does not run on its own: call `update()` every frame. It advances by `Time.delta_time`.

#### Constructor

Takes one options object.

| Parameter | Default | Description |
|-----------|---------|-------------|
| `element` | — | The `HTMLElement` to animate. |
| `css_property` | — | Key on `element.style`, for example `'opacity'` or `'transform'`. |
| `from` / `to` | `0` / `1` | Start and end values. |
| `duration` | `1` | In seconds. |
| `value_prefix` / `value_suffix` | `''` | Wrapped around the number: `'translateX('` and `'px)'` write `translateX(42px)`. |
| `easing_function` | `EasingFunctions.ease_in_out_cubic` | Any `(x) => number`, usually an `EasingFunctions` method. |
| `finished_callback` | no-op | Called with the animator when it finishes. |

Every option is kept as a public property of the same name, so you can change them between runs. `current_state` holds the internal `Idle` or `Animating` state.

#### Computed Properties

| Property | Type | Description |
|----------|------|-------------|
| `is_animating` | `boolean` | `true` from `animate()` until it finishes or `stop()` is called. |

#### Methods

| Method | Description |
|--------|-------------|
| `animate()` | Starts from `from`, or restarts if it is running. The first value is written on the next `update()`. |
| `update()` | Adds `Time.delta_time / duration` to its progress and writes `lerp(from, to, easing(progress))`, with the eased value clamped to 0–1. |
| `stop()` | Stops where it is. It does not write `to` or call `finished_callback`. |
| `set_property_value(value)` | Writes `` `${value_prefix}${value}${value_suffix}` `` to the property now. |
| `set_current_state(state)` | Swaps the state (`on_exit()`, then `on_enter()`). `animate()` and `stop()` use it. |

#### When It Finishes

It finishes on the first `update()` where the clamped eased value is at least `0.9999`: it writes `to`, goes idle and calls `finished_callback`. Nothing stops it when progress reaches 1, so the curve decides when it ends:

- On time: `linear`, every `ease_in_*` except `circ` and `bounce`, the `out` and `in_out` curves of `cubic`, `quart` and `quint`, and `ease_out_bounce` / `ease_in_out_bounce`.
- Early, skipping the rest of the curve, because they touch 1 before the end: `ease_out_back`, `ease_in_out_back`, `ease_out_elastic`, `ease_in_out_elastic` and `heartbeat`.
- Never, or only by luck, because they peak at 1 and fall after it: always `ease_in_circ` (`NaN`) and `triangular`, often `ease_in_bounce`. `ease_out_quad`, `ease_in_out_quad` and the `out` / `in_out` circ and sine curves miss more often the shorter the duration.
- Late: `ease_out_expo` and `ease_in_out_expo` run about 35% and 12% past `duration`, and the sine curves and `ease_in_elastic` can too.

---

## Usage

```ts
// After the GLTF loads: one animated copy, with shadows, and particles on its body
const character = ModelUtilities.clone_animated_gltf(ResourceContainer.get('character'));
ModelUtilities.set_shadow_config(character.scene, true, true);

const body = ModelUtilities.get_object(character.scene, 'Body') as Mesh;
const { points, normals } = MeshSampler.sample(body.geometry, 500);

// When the overlay shows: load its images and fade it in
const overlay = document.querySelector<HTMLElement>('.home__overlay');
HTMLUtilities.load_images(overlay);

const fade = new CSSAnimator({
  element: overlay,
  css_property: 'opacity',
  duration: 0.6,
  easing_function: EasingFunctions.ease_out_cubic
});
fade.animate();

// In update():
fade.update();
this.t += Time.delta_time;
glow_material.opacity = OMath.lerp(0.2, 1, EasingFunctions.ease_in_out_sine(OMath.pingpong(this.t)));
```
