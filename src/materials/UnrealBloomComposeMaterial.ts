import { BlitMaterial } from './BlitMaterial';

import frag from '../shaders/gaussian_blur/unreal_bloom_compose.frag';

import type { Texture } from 'three';
import { Color } from 'three';
class UnrealBloomComposeMaterial extends BlitMaterial
{
  constructor(nMips: number, use_linear_color_space = false)
  {
    super(frag, undefined, {
      NUM_MIPS: nMips
    });
    this.uniforms._MainTex        = { value: undefined };
    this.uniforms._BlurredTex     = { value: undefined };
    this.uniforms._BloomStrength  = { value: 1 };

    this.uniforms.blurTexture1  = { value: null };
    this.uniforms.blurTexture2  = { value: null };
    this.uniforms.blurTexture3  = { value: null };
    this.uniforms.blurTexture4  = { value: null };
    this.uniforms.blurTexture5  = { value: null };

    this.uniforms.bloomStrength = { value: 1.0 };
    this.uniforms.bloomFactors  = { value: [1.0, 0.8, 0.6, 0.4, 0.2] };
    this.uniforms.bloomRadius   = { value: 1.0 };

    this.defines.USE_LINEAR_COLOR_SPACE = use_linear_color_space;
    const bloomTintColors = [
      new Color('#FFFFFF'),
      new Color('#FFFFFF'),
      new Color('#FFFFFF'),
      new Color('#FFFFFF'),
      new Color('#FFFFFF')
    ];

    this.uniforms.bloomTintColors = { value: bloomTintColors };
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
