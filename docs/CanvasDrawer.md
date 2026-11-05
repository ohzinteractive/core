# CanvasDrawer

Draws text into an offscreen 2D canvas and wraps it in a Three.js `CanvasTexture`. `CanvasDrawer` is the base class: it owns the canvas, measures text and builds the texture, and leaves the drawing to a subclass. `SimpleTextDrawer` is the built-in subclass that draws one line of text on a canvas sized to fit it. `Text2D` uses it. Use these classes when you need a text texture for your own material or mesh; for a ready-made text plane, use `Text2D` (see [Components](Components.md)).

## Export

```ts
import { CanvasDrawer } from './canvas_drawer/CanvasDrawer';
import { SimpleTextDrawer } from './canvas_drawer/SimpleTextDrawer';
```

Not singletons — instantiated as needed.

## Draw Flow

```
draw_on_texture(text, options)
  └─ draw_canvas(text, options)
       ├─ options.font       ||= '24px Arial'
       ├─ options.font_color ||= '#000000'
       └─ __draw(text, options, canvas, ctx)   ← subclass resizes the canvas and draws
       returns this.canvas
  └─ new CanvasTexture(canvas)                 ← one new texture per call
```

Every call draws into the same `canvas`. Textures from earlier calls share it, so they show the new content after their next upload.

---

## CanvasDrawer

Base class. On its own `__draw()` does nothing, so `draw_canvas()` returns an untouched 300 × 150 canvas.

### Constructor

| Parameter | Description |
|-----------|-------------|
| `uses_dynamic_font?` | When `true`, the font height is measured again on every call instead of once. Defaults to `false`. |

Creates its own `<canvas>` and 2D context. The canvas is never added to the page.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `canvas` | `HTMLCanvasElement` | The offscreen canvas every draw writes into. |
| `ctx` | `CanvasRenderingContext2D` | 2D context of `canvas`. |
| `uses_dynamic_font` | `boolean` | Re-measures the font height on every `getFontHeight()` call. With `false`, the first height measured is cached and returned for every font after it, so one drawer should keep one font. |

### Methods

#### Drawing

| Method | Returns | Description |
|--------|---------|-------------|
| `draw_canvas(text, ctxOptions?)` | `HTMLCanvasElement` | Fills in the `font` and `font_color` defaults **on the object you pass**, calls `__draw()`, and returns `canvas`. |
| `draw_on_texture(text, ctxOptions)` | `CanvasTexture` | Calls `draw_canvas()` and wraps the canvas in a new `CanvasTexture`: clamp to edge, nearest min and mag filters, no mipmaps, `needsUpdate = true`. It sets no color space; set `colorSpace = SRGBColorSpace` to render CSS colors as given (`Text2D` does). |

#### Measuring

| Method | Returns | Description |
|--------|---------|-------------|
| `get_text_size(text, font?)` | `Vector2` | Width from `ctx.measureText()` and height from `getFontHeight()`, both rounded up, in pixels. `font` is a CSS `font` string and defaults to `'24px Arial'`. Sets `ctx.font`. |
| `getFontHeight(fontStyle?)` | `number` | Height in pixels of a hidden `<div>` styled with `font: fontStyle`, added to `<body>` and removed right after. Cached unless `uses_dynamic_font` is `true`. Needs `document.body`. |

#### Helpers

| Method | Description |
|--------|-------------|
| `roundRect(ctx, x, y, width, height, radius, fill, stroke)` | Traces a rounded rectangle path on `ctx`, then fills it if `fill` and strokes it if `stroke`. `radius` is a number or `{ tl, tr, br, bl }`, where missing corners are 0. With `undefined`, `radius` is 5 and `stroke` is `true`. It writes the missing corners into the `radius` object you pass. |

#### Extending

| Method | Description |
|--------|-------------|
| `__draw(text, ctxOptions, canvas, ctx)` | Empty in the base class. Override it to resize `canvas` and draw `text` with `ctx`. `ctxOptions` already has `font` and `font_color`. Setting `canvas.width` or `height` resets the context state, so set `ctx.font` and the fill style after resizing. |

```ts
class BadgeDrawer extends CanvasDrawer
{
  __draw(text: string, ctxOptions: any, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D)
  {
    const size = this.get_text_size(text, ctxOptions.font);
    canvas.width = size.x + 16;
    canvas.height = size.y + 8;

    ctx.fillStyle = '#222222';
    this.roundRect(ctx, 0, 0, canvas.width, canvas.height, 6, true, false);

    ctx.font = ctxOptions.font;
    ctx.fillStyle = ctxOptions.font_color;
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 8, canvas.height / 2);
  }
}
```

---

## SimpleTextDrawer

Extends `CanvasDrawer`. Draws one line of text on a transparent canvas sized to the text plus `text_margin`.

### Constructor

Takes no parameters, so `uses_dynamic_font` starts as `false`. Set the property after construction to change it.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `text_margin` | `Vector2` | Padding in pixels on each side, added twice to the canvas width (`x`) and height (`y`). Defaults to `(2, 0)`. |

### Draw Options

The `ctxOptions` object passed to `draw_canvas()` and `draw_on_texture()`:

| Option | Type | Description |
|--------|------|-------------|
| `font` | `string` | CSS `font` string, e.g. `'bold 48px Arial'`. Defaults to `'24px Arial'`. |
| `font_color` | `string` | CSS color for the text. Defaults to `'#000000'`. A number is not a valid canvas color, so the text stays black. |
| `textAlign` | `CanvasTextAlign` | Defaults to `'center'`, which draws the text in the middle of the canvas. Any other value draws it at `x = 0`, so `'left'` and `'start'` work, while `'right'` and `'end'` draw the text off the canvas. |

Text is drawn with `textBaseline = 'middle'`, centered vertically. The canvas is cleared on each draw, so the background is transparent.

## Usage

```ts
const drawer = new SimpleTextDrawer();
const options = { font: 'bold 48px Arial', font_color: '#ffffff' };

const texture = drawer.draw_on_texture('Score: 0', options);
texture.colorSpace = SRGBColorSpace;
texture.needsUpdate = true;

const material = new MeshBasicNodeMaterial({ map: texture, transparent: true });
const aspect = drawer.canvas.width / drawer.canvas.height;
const label = new Mesh(new PlaneGeometry(aspect, 1), material);

// Later: redraw into the same canvas and re-upload
drawer.draw_canvas('Score: 10', options);
texture.needsUpdate = true;
```

A new text width resizes the canvas but not the plane, so update the geometry or scale when the text length changes.
