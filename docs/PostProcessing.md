# PostProcessing

Full screen passes over render targets: a base material for writing your own pass, three blurrers, and the materials that compose bloom. The built-in render modes use them (see [RenderModes](RenderModes.md)). Use them directly when you write your own `BaseRender` and need a blurred copy of the frame, a glow, or a custom screen space effect. Every pass runs through `Graphics.blit()` or `Graphics.material_pass()` (see [Graphics](Graphics.md)) and works on both `WebGPURenderer` backends.

## Export

```ts
import { BlitNodeMaterial } from './materials/BlitNodeMaterial';
import { AddMaterial } from './materials/AddMaterial';
import { UnrealBloomComposeMaterial } from './materials/UnrealBloomComposeMaterial';
import { DualFilteringBlurMaterial } from './materials/DualFilteringBlurMaterial';
import { Blurrer } from './render_utilities/Blurrer';
import { GaussianBlurrer } from './render_utilities/GaussianBlurrer';
import { DualFilteringBlurrer } from './render_utilities/DualFilteringBlurrer';
```

Not singletons. Instantiate them as needed, and call `dispose()` (or `dispose_RT()` and `dispose_materials()` on `GaussianBlurrer`) when you're done with one.

## How a Pass Runs

`Graphics.blit(src, dst, mat)` draws a 1×1 quad that the material stretches over the whole target. Before drawing, it sets the material's `_MainTex` to `src` (its `.texture` if `src` is a render target), `_Resolution` to the source size in pixels, and `_TargetResolution` to `dst`'s size (the canvas size when `dst` is `undefined`). Without `mat`, it copies `src` with its own `BlitNodeMaterial`. `Graphics.material_pass(mat, dst)` draws the same quad but sets no uniforms, for materials that read only their own textures.

---

## BlitNodeMaterial

A `NodeMaterial` from `three/webgpu` and the base class of every full screen pass in core. Its vertex stage covers clip space. Its fragment stage outputs `_MainTex` unchanged. It turns off depth test, depth write and blending. Its sampling helpers flip the UVs for render targets, which have a top left origin, so render targets and regular textures both come out upright.

### Constructor

Takes no parameters. Subclasses call `super()`, then replace `fragmentNode`:

```ts
import { vec4 } from 'three/tsl';

class InvertMaterial extends BlitNodeMaterial
{
  constructor()
  {
    super();

    const color = this.sample_main_tex();
    this.fragmentNode = vec4(color.rgb.oneMinus(), color.a);
  }
}
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `uniforms` | `{ [name: string]: { value: any } }` | TSL nodes by name. Starts with `_MainTex` (texture), `_Resolution` and `_TargetResolution` (`Vector2`, in pixels). Subclasses add theirs here, so callers set any uniform with `mat.uniforms.<name>.value`. |
| `uv_by_texture` | `Map<TextureNode, Node>` | Cache of the UV node built per texture node by `uv_for()`. |
| `top_left_origin_by_texture` | `Map<TextureNode, Node>` | Cache of the per draw origin check built by `texture_uv_at()`. |

### Methods

#### Sampling (use these in subclass constructors)

| Method | Returns | Description |
|--------|---------|-------------|
| `sample_main_tex(offset?)` | `Node` | Samples `_MainTex` at the quad UV, plus `offset` (a `vec2` node in UV units). |
| `sample(texture_node, offset?)` | `Node` | Same for any texture node. Use it for extra textures you add to `uniforms`. |
| `uv_for(texture_node)` | `Node` | The quad UV, flipped when the bound texture has a top left origin. The check runs on every draw, so one material can blit both kinds. |
| `texture_uv_at(texture_node, quad_uv)` | `Node` | The same mapping for any point given in the quad's bottom left UV space. |

---

## Blurrer

A two pass, 9 tap separable blur (`BoxBlurMaterial`) at the input's size. Taps sit one texel apart, so the blur spans 9×9 texels. `BloomRender` and `NormalAORender` use it.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `RT1` | `RenderTarget` | Holds the horizontal pass. Resized to the input. |
| `RT2` | `RenderTarget` | Resized to the input but never rendered to. |
| `box_blur_mat` | `BoxBlurMaterial` | The blur pass. `blur()` sets its `_SampleDir` uniform. |

### Methods

| Method | Description |
|--------|-------------|
| `blur(RT)` | Blurs `RT` in place: horizontally into `RT1`, then vertically back into `RT`. |
| `dispose()` | Disposes both targets and the material. |

Its targets use the `RenderTarget` defaults (8-bit RGBA), whatever the input's type, so a half float input loses precision in the horizontal pass.

---

## DualFilteringBlurrer and DualFilteringBlurMaterial

A dual filtering (Kawase) blur. It halves the image down to 1/16 of the input, then scales it back up, so it spreads much wider than `Blurrer` for the same cost. `new BloomRender(true)` uses it.

```
blur(RT)
  RT ──copy──► RT1 (1/2) ──down──► RT2 (1/4) ──down──► RT3 (1/8) ──down──► RT4 (1/16)
                                                                              │
  RT ◄──up────────────── RT2 ◄──up────────────── RT3 ◄──up────────────────────┘
```

Targets are sized in whole pixels, at least 1×1, so an input under 16 pixels blurs to its average instead of rendering black. They use the `RenderTarget` defaults (8-bit RGBA, linear filtering). The taps rely on linear filtering, so keep it on the input too.

### DualFilteringBlurrer Properties

| Property | Type | Description |
|----------|------|-------------|
| `RT1` … `RT4` | `RenderTarget` | The chain above, at 1/2, 1/4, 1/8 and 1/16 of the input. `RT0` also exists but is never sized or used. |
| `current_width` / `current_height` | `number` | The input size the chain was last sized for. |
| `downscale_blur_mat` / `upscale_blur_mat` | `DualFilteringBlurMaterial` | The two passes. |

### DualFilteringBlurrer Methods

| Method | Description |
|--------|-------------|
| `blur(RT)` | Blurs `RT` in place along the chain above. Resizes the chain first if the input size changed. |
| `check_RT_resize(width, height)` | Resizes the chain when the size differs from the last one. Called by `blur()`. |
| `resize(target, divisor)` | Sets `target` to the current size divided by `divisor`, floored, at least 1. |
| `dispose()` | Disposes all five targets and both materials. |

### DualFilteringBlurMaterial

One pass of the blur, a `BlitNodeMaterial`. Its required constructor flag `upsample` picks the kernel. `false` takes the center (weight 4) plus four diagonals (weight 1). `true` takes a ring of eight taps two half texels out, where the diagonals weigh twice the sides. Offsets are in half source texels, read from `_Resolution`, so drive it with `Graphics.blit()`, not `material_pass()`.

---

## GaussianBlurrer

A five mip separable Gaussian blur, with an optional luminosity high pass first. Each mip blurs the previous one at half its size, with a wider kernel, so later mips hold wider glows. `UnrealBloomRender` uses it.

```
blur(RT, use_luminosity_high_pass)
  RT ─(high pass?)─► renderTargetBright (1/2)
     │
     └─► mip i, for i = 0..4, at 1/2^(i+1) of RT, kernel kernelSizeArray[i]:
           input ──horizontal──► renderTargetsHorizontal[i] ──vertical──► renderTargetsVertical[i]
           input = renderTargetsVertical[i]
```

### Constructor

| Parameter | Description |
|-----------|-------------|
| `use_half_float` | Default `false`, which uses `UnsignedByteType` targets in sRGB. `true` uses `HalfFloatType` targets in linear sRGB. |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `renderTargetsVertical` | `RenderTarget[]` | The result: one blurred texture per mip, finest first. |
| `renderTargetsHorizontal` | `RenderTarget[]` | The horizontal pass of each mip. Scratch space once `blur()` returns. |
| `renderTargetBright` | `RenderTarget` | The high pass output, at half the input size. |
| `separableBlurMaterials` | `GaussianBlurMaterial[]` | One blur material per mip. |
| `luminosity_high_pass_mat` | `LuminosityHighPassMaterial` | The high pass. |
| `nMips` / `kernelSizeArray` | `number` / `number[]` | `5` mips, with kernel radii `[3, 5, 7, 9, 11]`. |
| `rt_pars` / `use_half_float` | `RenderTargetOptions` / `boolean` | The target options and the constructor flag they come from. |
| `current_width` / `current_height` | `number` | The input size the mips were last sized for. |

### Methods

#### Blurring

| Method | Returns | Description |
|--------|---------|-------------|
| `blur(RT, use_luminosity_high_pass)` | `void` | Runs the chain above on `RT`, which is left unchanged. `use_luminosity_high_pass` is required: `true` blurs only the pixels brighter than the threshold. |
| `get_blurred_texture()` | `Texture` | `renderTargetsHorizontal[0].texture`. After `blur()` alone it holds only the horizontal pass of mip 0. Read `renderTargetsVertical[i]` for the blurred mips. |
| `get_blurred_RT()` | `RenderTarget` | `renderTargetsHorizontal[0]`, with the same caveat. |

#### Tuning

| Method | Description |
|--------|-------------|
| `set_radius(value)` | Scales the tap spacing of every mip's blur. Default `1`. |
| `set_luminosity_threshold(value)` | Sets the high pass threshold (0–1). Default `0.23`. |

#### Resources

| Method | Description |
|--------|-------------|
| `resize_RT(width, height)` | Resizes every target and blur material for an input of that size. Called by `blur()`; it does nothing when the size matches the last one. |
| `init_RT()` / `init_materials()` | Dispose and rebuild the mip targets or the blur materials. The constructor calls both. |
| `dispose_RT()` / `dispose_materials()` | Dispose the targets or the blur materials. There is no `dispose()`, and neither of them frees `luminosity_high_pass_mat`. |

---

## Bloom Composition

### UnrealBloomComposeMaterial

Sums blurred mips into one bloom texture, each weighted by a radius dependent factor and a tint. It reads only its own textures, so run it with `Graphics.material_pass()`.

The output is `bloomStrength × Σ blurTexture_i × tint_i × mix(f_i, 1.2 − f_i, bloomRadius)`, where `f` is `[1.0, 0.8, 0.6, 0.4, 0.2]` (mips past the fifth reuse `0.2`). At radius `0` the finest mip weighs most. At the default radius `1` the widest does.

| Constructor parameter | Description |
|-----------------------|-------------|
| `nMips` | Required. How many blur textures it sums. `UnrealBloomRender` passes `5`. |
| `use_linear_color_space` | Default `false`. Ignored: kept for API compatibility, since node materials always work in linear. |

| Method | Description |
|--------|-------------|
| `set_blur_texture_0(texture)` … `set_blur_texture_4(texture)` | Binds the texture of mip 0 to 4 (uniforms `blurTexture1` to `blurTexture5`). |
| `set_bloom_strength(value)` | Scales the whole sum. Default `1`. |
| `set_bloom_radius(value)` | Moves the weights between the fine and wide mips, as above. Default `1`. |
| `set_tint_color_0(col_string)` … `set_tint_color_4(col_string)` | Tints one mip. Takes any string `Color.set()` accepts. Default white. |

The numbered setters assume five mips. With fewer, the missing ones throw. With more, set `uniforms[`blurTexture${i + 1}`].value` yourself.

### AddMaterial

Outputs `_MainTex + _SecondTex`, alpha included. Bind the second texture once with `set_add_texture(tex)`, then blit the first through it. Its constructor flag `use_half_float` (default `false`) is ignored, kept for API compatibility.

---

## Usage

```ts
// A render mode that adds a wide blurred copy of the scene over itself.
class GlowRender extends BaseRender
{
  scene_RT = new RenderTarget(1, 1);
  glow_RT = new RenderTarget(1, 1);
  blurrer = new DualFilteringBlurrer();
  add_mat = new AddMaterial();

  on_enter()
  {
    this.add_mat.set_add_texture(this.glow_RT.texture);
  }

  render()
  {
    if (this.scene_RT.width !== OScreen.width || this.scene_RT.height !== OScreen.height)
    {
      this.scene_RT.setSize(OScreen.width, OScreen.height);
      this.glow_RT.setSize(OScreen.width, OScreen.height);
    }

    Graphics.clear(this.scene_RT, CameraManager.current, true, false);
    Graphics.render(SceneManager.current, CameraManager.current, this.scene_RT);

    Graphics.blit(this.scene_RT, this.glow_RT);              // copy
    this.blurrer.blur(this.glow_RT);                         // blur in place
    Graphics.blit(this.scene_RT, undefined, this.add_mat);   // scene + glow to the canvas
  }

  dispose()
  {
    this.scene_RT.dispose();
    this.glow_RT.dispose();
    this.blurrer.dispose();
    this.add_mat.dispose();
  }
}

Graphics.set_state(new GlowRender());
```
