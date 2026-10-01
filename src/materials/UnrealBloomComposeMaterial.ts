import { BlitNodeMaterial } from './BlitNodeMaterial';

import { Color, Texture } from 'three';
import { mix, texture, uniform, vec4 } from 'three/tsl';
import type { Node } from 'three/webgpu';

const BLOOM_FACTORS = [1.0, 0.8, 0.6, 0.4, 0.2];

// Sums the blurred mips of GaussianBlurrer, each weighted by its bloom factor and tint.
// Uniforms are named after the original GLSL shader (blurTexture1..N, bloomStrength...).
// use_linear_color_space is kept for API compatibility: node materials sample and write
// linear values on every target, so it no longer changes the shader.
class UnrealBloomComposeMaterial extends BlitNodeMaterial
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(nMips: number, use_linear_color_space = false)
  {
    super();

    const bloom_strength = uniform(1);
    const bloom_radius = uniform(1);
    const tint_colors: Color[] = [];

    this.uniforms.bloomStrength = bloom_strength;
    this.uniforms.bloomRadius = bloom_radius;

    let bloom: Node<'vec4'> = vec4(0);

    for (let i = 0; i < nMips; i++)
    {
      const blur_tex = texture(new Texture());
      const tint_color = new Color('#FFFFFF');
      const factor = BLOOM_FACTORS[i] ?? BLOOM_FACTORS[BLOOM_FACTORS.length - 1];
      const lerped_factor = mix(factor, 1.2 - factor, bloom_radius);

      this.uniforms[`blurTexture${i + 1}`] = blur_tex;
      tint_colors.push(tint_color);

      bloom = bloom.add(this.sample(blur_tex).mul(vec4(uniform(tint_color), 1)).mul(lerped_factor));
    }

    // The tint uniforms hold these same Color instances, so editing them in place
    // updates the shader.
    this.uniforms.bloomTintColors = { value: tint_colors };

    this.fragmentNode = bloom.mul(bloom_strength);
  }

  set_blur_texture_0(texture: Texture)
  {
    this.uniforms.blurTexture1.value = texture;
  }

  set_blur_texture_1(texture: Texture)
  {
    this.uniforms.blurTexture2.value = texture;
  }

  set_blur_texture_2(texture: Texture)
  {
    this.uniforms.blurTexture3.value = texture;
  }

  set_blur_texture_3(texture: Texture)
  {
    this.uniforms.blurTexture4.value = texture;
  }

  set_blur_texture_4(texture: Texture)
  {
    this.uniforms.blurTexture5.value = texture;
  }

  set_bloom_strength(value: number)
  {
    this.uniforms.bloomStrength.value = value;
  }

  set_bloom_radius(value: number)
  {
    this.uniforms.bloomRadius.value = value;
  }

  set_tint_color_0(col_string: string)
  {
    ((this.uniforms.bloomTintColors.value as Color[])[0]).set(col_string);
  }

  set_tint_color_1(col_string: string)
  {
    ((this.uniforms.bloomTintColors.value as Color[])[1]).set(col_string);
  }

  set_tint_color_2(col_string: string)
  {
    ((this.uniforms.bloomTintColors.value as Color[])[2]).set(col_string);
  }

  set_tint_color_3(col_string: string)
  {
    ((this.uniforms.bloomTintColors.value as Color[])[3]).set(col_string);
  }

  set_tint_color_4(col_string: string)
  {
    ((this.uniforms.bloomTintColors.value as Color[])[4]).set(col_string);
  }
}

export { UnrealBloomComposeMaterial };
