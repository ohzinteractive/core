# Primitives

Small Three.js `Mesh` subclasses for placeholder and helper geometry: an arrow, a box, a sphere, and a plane on the floor or facing the camera. Each one builds its geometry and an unlit `MeshBasicMaterial` in the constructor, so a single line gives you something visible in the scene. `Debug.draw_arrow`, `draw_cube`, `draw_oriented_cube` and `draw_sphere` use them, and `ObjectAxis` is made of three `Arrow`s. For lit or textured content, build a `Mesh` with your own material instead.

## Export

```ts
import { Arrow } from './primitives/Arrow';
import { Cube } from './primitives/Cube';
import { Sphere } from './primitives/Sphere';
import { HorizontalPlane } from './primitives/HorizontalPlane';
import { VerticalPlane } from './primitives/VerticalPlane';
```

Not singletons — instantiated as needed.

| Class | Shape | Default |
|-------|-------|---------|
| `Arrow` | A thin shaft with a cone tip, pointing along +Z from its origin. | 1 unit long, red |
| `Cube` | A `BoxGeometry` centered on the origin. | 1 × 1 × 1, red |
| `Sphere` | A `SphereGeometry` with 64 × 64 segments, centered on the origin. | Radius 1, red |
| `HorizontalPlane` | A `PlaneGeometry` on the XZ plane, facing +Y. | 1 × 1, red |
| `VerticalPlane` | A `PlaneGeometry` on the XY plane, facing +Z. | 1 × 1, red |

All of them extend `Mesh` directly and add no methods. Position, rotate, scale and dispose them like any other mesh. They have no `dispose()` of their own, so call `geometry.dispose()` and `material.dispose()` when you remove one for good.

Every argument is optional. Arguments are checked with `||` in `Arrow`, `HorizontalPlane` and `VerticalPlane`, so a numeric `0` color (black) falls back to red there. Pass `'#000000'` instead. `Cube` and `Sphere` check the color with `??`, so `0` works.

The planes are single sided: they render from the side they face only.

---

## Arrow

### Constructor

```ts
new Arrow(color?, length?, dir?)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | `string \| number` | `'#FF0000'` | Material color. |
| `length` | `number` | `1` | Total length, tip included. The cone is always 0.4 long and 0.1 in radius, and the shaft is 0.01 in radius, so keep `length` at 0.4 or more. |
| `dir` | `Vector3` | — | Direction to point in. Must be normalized. Without it the arrow points along +Z. |

The base of the shaft sits at the mesh origin, so `position` is where the arrow starts.

### Computed Properties

| Property | Type | Description |
|----------|------|-------------|
| `dir` | `Vector3` | Setting it rotates the arrow from +Z to the new direction with `quaternion.setFromUnitVectors`, so it must be normalized. It stores the vector itself, not a copy: changing that vector later does not rotate the arrow. Reads `undefined` when no direction was ever set. |
| `length` | `number` | Reads and writes `scale.z`. It is a scale factor on the length given to the constructor, not a length in units: a new arrow reads `1`, and setting `2` on a 3 unit arrow makes it 6 units long, cone included. |

---

## Cube

### Constructor

```ts
new Cube(size?, segments?, color?)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `size` | `Vector3` | `(1, 1, 1)` | Width, height and depth. |
| `segments` | `Vector3` | `(1, 1, 1)` | Segments along each axis. |
| `color` | `number \| string` | `0xff0000` | Material color. |

---

## Sphere

### Constructor

```ts
new Sphere(radius?, color?)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `radius` | `number` | `1` | Sphere radius. |
| `color` | `number \| string` | `'#FF0000'` | Material color. |

Both parameters are typed as required but fall back to the defaults.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `radius` | `number` | The radius given to the constructor. It does not follow `scale`, and changing it does not resize the mesh. |
| `color` | `string \| number` | The color given to the constructor. Changing it does not change the material: set `material.color` instead. |
| `center` | `Vector3` | The same object as `position`, so it always matches the local position. |

With `center` and `radius`, a `Sphere` can be passed to `CameraController.focus_camera_on_sphere()` and `get_zoom_to_sphere()`. Those read the local position and the constructor radius, so keep the sphere unscaled and directly in the scene when you use it that way.

---

## HorizontalPlane and VerticalPlane

### Constructor

```ts
new HorizontalPlane(width?, height?, color?, material?)
new VerticalPlane(width?, height?, color?, material?)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `width` | `number` | `1` | Size along X. |
| `height` | `number` | `1` | Size along Z for `HorizontalPlane`, along Y for `VerticalPlane`. |
| `color` | `number \| string` | `'#FF0000'` | Color of the default material. Ignored when `material` is given. |
| `material` | `Material` | `MeshBasicMaterial` | Material to use instead of the default one. |

Both are one segment, centered on the origin. `HorizontalPlane` is a `PlaneGeometry` rotated onto the floor, so its `rotation` stays at zero.

---

## Usage

```ts
import { Vector3 } from 'three';

// Floor, with a custom material
const floor = new HorizontalPlane(20, 20, undefined, floor_material);
scene.add(floor);

// A box resting on the floor
const crate = new Cube(new Vector3(1, 2, 1), undefined, 0x8b5a2b);
crate.position.set(0, 1, 0);
scene.add(crate);

// An arrow showing the crate's forward direction
const arrow = new Arrow('#00FF00', 1.5, new Vector3(0, 0, 1));
arrow.position.set(0, 2.5, 0);
scene.add(arrow);

// Later: point it somewhere else
arrow.dir = new Vector3(1, 0, 1).normalize();

// Frame a spot with the camera
const target = new Sphere(3, '#FFFFFF');
target.position.set(5, 0, 5);
target.visible = false;
scene.add(target);
camera_controller.focus_camera_on_sphere(target, false);
```
