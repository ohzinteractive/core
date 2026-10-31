# Components

Ready-made Three.js `Mesh` subclasses for common scene content: a ground grid, a thick line, an image or canvas text on a plane, batched SDF text, and a mesh that lets its material update itself before every draw. Add them to a scene like any other mesh. `Text2D` extends `WorldImage`. The others extend `Mesh` directly. Every material behind them is TSL and runs on `WebGPURenderer` with both backends. `Grid`, `Line`, `WorldImage`, `Text2D` and `SDFTextBatch` render transparent with `depthWrite` off. All of them except `Grid` ignore scene fog.

## Export

```ts
import { Grid } from './components/Grid';
import { Line } from './components/Line';
import { WorldImage } from './components/WorldImage';
import { Text2D } from './components/Text2D';
import { SDFTextBatch } from './components/sdf_text/SDFTextBatch';
import { UpdatableMaterialMesh } from './components/UpdatableMaterialMesh';
```

Not singletons — instantiated as needed.

| Class | Use it for |
|-------|------------|
| `Grid` | A reference floor while building a scene. |
| `Line` | A polyline with a thickness, such as a path or a connector. |
| `WorldImage` | A texture on a plane that keeps the image's aspect ratio, optionally facing the camera. |
| `Text2D` | A label or two. Each one is a canvas, a texture and a draw call. |
| `SDFTextBatch` | Many labels, or text that must stay sharp up close. All of them share one draw call. |
| `UpdatableMaterialMesh` | A custom material that needs a per-frame `update()`. |

---

## Grid

A 100 × 100 unit plane on the XZ plane, centered on the origin, with a line every unit. The lines are `#4a4a4a` at 20% opacity. Grid draws no diagonals because the plane is made non-indexed with a `barycentric` attribute (`GeometryUtilities.convert_to_non_indexed_geometry`), and the shader only draws one edge of each triangle. The material is a transparent `MeshBasicNodeMaterial` with `depthWrite` off.

The constructor takes no parameters. The grid is not infinite. To resize or move it, use `scale` and `position`.

---

## Line

A polyline drawn as a flat ribbon that faces the camera. Each point is stored twice, and the vertex stage pushes the two copies apart, across the line and toward the camera. The ribbon has the full color along its middle and half the brightness at its edges, and it is always opaque.

### Constructor

| Parameter | Description |
|-----------|-------------|
| `points?` | `Vector3[]` in local space. When given, `setup(points)` runs right away. It needs at least 2 points. |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `accumulated_length` | `number` | Sum of the segment lengths, set by `setup()`. |
| `material` | `LineMaterial` | Holds `_Thickness`, `_Color`, and `_Length` (kept equal to the length; the shader does not read it). |

### Computed Properties

| Property | Type | Description |
|----------|------|-------------|
| `thickness` | `number` | Ribbon width in world units. Default `0.2`. |
| `color` | `Color` | Set it with any `ColorRepresentation`. The getter returns the live uniform `Color`. Default `#FF0000`. |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `setup(points)` | `void` | Rebuilds the line from `points` (at least 2). With the same point count, the attributes are rewritten in place. With a different count, `geometry` is replaced by a new one and the old one is disposed, because `WebGPURenderer` never resizes a GPU buffer. Don't keep references to `line.geometry`. |
| `copy_color(col)` | `void` | Copies a `Color` into the line color. |
| `distance()` / `total_length()` | `number` | Both return `accumulated_length`. |
| `update()` | `void` | Does nothing. |
| `dispose()` | `void` | Disposes the geometry and material, removes the line from its parent if it has one, and fires `dispose`. |

---

## WorldImage

A texture on a plane that is 1 world unit tall and as wide as the image's aspect ratio. Opacity scales the texture's alpha. When `screen_aligned` is on, the plane ignores the object's rotation and faces the camera. It is still sized in world units, so it shrinks with distance.

### Constructor

| Parameter | Description |
|-----------|-------------|
| `texture` | A `Texture` whose `image` has `width` and `height`. The image must be loaded already. |
| `pivot` | `Vector2` from -1 to 1, the point of the image that sits on the object's origin. `(0, 0)` (the default when omitted) is the center, `(-1, -1)` the bottom-left corner, `(1, 1)` the top-right corner. |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `material` | `WorldImageMaterial` | Holds `_MainTex`, `_ScreenAligned`, `_Scale` and `_Opacity`. Uses `DoubleSide`. |
| `current_scale` | `number` | The image aspect ratio (width / height) the plane is stretched to. |
| `texture_size` | `Vector2` | Image size in pixels, as last measured. |
| `sized_texture` | `Texture` | The texture `texture_size` was measured from. |

### Computed Properties

| Property | Type | Description |
|----------|------|-------------|
| `size` | `Vector3` | **Get:** a new `Vector3` with the plane's world width and height (`z` is 0), scaled by `scale.x`. **Set:** copies the vector into `scale` and into `_Scale`. The setter takes a scale, so `image.size = image.size` makes the image grow. |
| `screen_aligned` | `boolean` | Makes the plane face the camera. While it is on, the plane is scaled by `_Scale`, not by the object's `scale`, so resize it with `size`, not `scale`. Default `false`. |
| `opacity` | `number` | Multiplies the texture's alpha. Default `1`. |

### Methods

| Method | Description |
|--------|-------------|
| `update_texture()` | Call it after the texture's image changes or after you swap `material.uniforms._MainTex.value`. It measures the image again, sets the plane's width to the new aspect ratio, and flags the texture for upload. If the texture is the one measured before and its size changed, it disposes it first, because `WebGPURenderer` never resizes a GPU texture. A newly swapped texture is never disposed. |
| `dispose()` | Disposes the geometry, the material and the texture in `_MainTex`, removes the image from its parent and fires `dispose`. It throws if the image has no parent. |

### Text2D

A `WorldImage` showing one line of text drawn on a canvas by a `SimpleTextDrawer`. The plane is 1 unit tall whatever the font size, so the font size sets the sharpness, not the size on screen. The canvas texture is tagged sRGB, so the text renders in its CSS color. It uses linear minification, nearest magnification and no mipmaps.

| Constructor parameter | Description |
|-----------------------|-------------|
| `text` | The string to draw. |
| `font` | A CSS font, for example `'bold 48px Arial'`. |
| `color` | A CSS color string. Falsy values give `'#000000'`. The type also allows a number, but a canvas `fillStyle` ignores numbers, so the text stays black. |
| `pivot` | Same as `WorldImage`. |

| Property | Type | Description |
|----------|------|-------------|
| `text` | `string` | **Set:** redraws the canvas with `draw_settings` and calls `update_texture()`. **Get:** always returns `'not implemented'`. |
| `draw_settings` | `{ font, font_color }` | Used on every redraw. Change it, then set `text` again to restyle. |
| `canvas_texture` | `CanvasTexture` | The texture the canvas is drawn into. |
| `simple_text_drawer` | `SimpleTextDrawer` | Owns the canvas. |

---

## SDFTextBatch

Draws multi-channel signed distance field (MSDF) text. Every text in the batch is drawn in one instanced call, one instance per glyph, and stays sharp at any distance. The batch mesh's own transform is ignored, so place each text on its own. `frustumCulled` is `false`. The batch has room for 2000 glyphs.

### Constructor

| Parameter | Description |
|-----------|-------------|
| `font_layout` | The msdf-atlas-gen JSON layout: `atlas.width`, `atlas.height`, and `glyphs[]` with `unicode`, `advance`, `planeBounds` and `atlasBounds`. Atlas bounds must count from the bottom (`yOrigin: bottom`). Glyph sizes are in em units. |
| `atlas_texture` | The MSDF atlas `Texture`. The material sets its filters to linear and turns off mipmaps. |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `text_elements` | `SDFText[]` | The texts in draw order. |
| `font_layout` | `object` | The layout passed to the constructor. |
| `material` | `SDFTextMaterial` | Holds `_Texture`, `_Boldness` and `_AtlasSize`. |
| `geometry` | `InstancedBufferGeometry` | A unit quad plus seven `vec4` per glyph attributes in one `InstancedInterleavedBuffer`, because WebGPU allows 8 vertex buffers per pipeline. |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `add_text(text_str)` | `SDFText` | Creates a text with the font's glyphs and appends it. The text must contain at least one glyph the font can draw. |
| `remove_text(text)` | `void` | Removes it and calls `update(true)`. |
| `update(force_update?)` | `void` | Writes every glyph into the buffer and sets the instance count. Call it once per frame, or after any change. |
| `set_boldness(value)` | `void` | `0` is regular weight and `1` is the heaviest. It moves the edge threshold from 0.5 to 0.2. |
| `dispose()` | `void` | Disposes the geometry and material and fires `dispose`. It does not dispose the atlas or remove the batch from its parent. |

### Update Flow

```
text.set_position / set_size / set_rotation   → matrix_is_dirty
text.text = '...' / set_pivot / update_glyphs → glyph_is_dirty
text.set_color / text.opacity = …             → color_is_dirty
        │
        ▼
batch.update(force_update)
  ├─ each text: compose its matrix if dirty, clear its flags
  ├─ write every glyph of every text (matrix, bounds, color) at instance i
  ├─ geometry.instanceCount = glyph count
  └─ any flag or force_update → buffer uploads on the next render
```

### SDFText

Returned by `add_text()`. It is not exported. Use its setters: assigning `position`, `quaternion` or `scale` directly doesn't mark the text dirty, so the change shows only after something else does.

| Member | Description |
|--------|-------------|
| `text` | Get or set the string. Setting it rebuilds the glyphs. Characters missing from the font are skipped without advancing. A string with no drawable glyph (empty, spaces only) throws. |
| `opacity` | Get or set the alpha, from 0 to 1. |
| `set_position(pos)` | Copies a `Vector3` into `position`. |
| `set_size(size)` | Sets a uniform `scale`. At `1`, one em is one world unit. |
| `set_rotation(orientation?, tilt?)` | Degrees. `orientation` turns the text around Y (0 to 360) and `tilt` around X (-90 to 90). Both default to `0`. |
| `set_color(col)` | Sets the color. The default is white. |
| `set_pivot(pivot)` | `Vector2` that moves the text by half its size per unit. `(0, 0)` centers it on `position`, and `(1, 1)` puts its bottom-left corner there. This is the opposite of the `WorldImage` pivot. |
| `update_glyphs()` | Rebuilds the glyph layout. |
| `glyphs` | `TextGlyph[]`, each with `position` and `scale` (`Vector2`, em units) and `atlas_bounds` (`Vector4`: left, right, top, bottom). |

`update_matrix()`, `clear_glyph_dirty()` and `clear_color_dirty()` are called by `SDFTextBatch.update()`.

---

## UpdatableMaterialMesh

A `Mesh` whose `onBeforeRender` calls `material.update()` before each draw, if the material has an `update` method. No core material has one, so it is meant for your own materials, such as one that advances a time uniform.

| Constructor parameter | Description |
|-----------------------|-------------|
| `geometry` | A `BufferGeometry`. |
| `material` | A single `Material`. With an array of materials, `update()` is never called. |

Assigning `onBeforeRender` yourself replaces the hook.

## Usage

```ts
const grid = new Grid();
scene.add(grid);

const path = new Line([new Vector3(0, 0, 0), new Vector3(2, 1, 0), new Vector3(4, 0, 2)]);
path.thickness = 0.05;
path.color = '#00ffcc';
scene.add(path);

const label = new Text2D('Hello', 'bold 48px Arial', '#ffffff', new Vector2(0, -1));
label.position.set(0, 2, 0);
label.screen_aligned = true;
label.size = new Vector3(0.5, 0.5, 0.5);
scene.add(label);

const batch = new SDFTextBatch(ResourceContainer.get('font_layout'), ResourceContainer.get('font_atlas'));
const title = batch.add_text('OHZI');
title.set_position(new Vector3(0, 3, 0));
title.set_size(0.5);
scene.add(batch);

// Every frame:
batch.update();
```
