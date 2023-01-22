import { BlitMaterial } from './BlitMaterial';

import frag from '../shaders/gaussian_blur/unreal_bloom_compose.frag';

import { Color } from 'three';
class UnrealBloomComposeMaterial extends BlitMaterial
{
  constructor(nMips)
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
    this.uniforms.bloomRadius   = { value: 0.0 };

    const bloomTintColors = [
      new Color('#FFFFFF'),
      new Color('#FFFFFF'),
      new Color('#FFFFFF'),
      new Color('#FFFFFF'),
      new Color('#FFFFFF')
    ];

    this.uniforms.bloomTintColors = { value: bloomTintColors };
  }

  set_RT_0(rt)
  {
    this.uniforms.blurTexture1.value = rt;
  }

  set_RT_1(rt)
  {
    this.uniforms.blurTexture2.value = rt;
  }

  set_RT_2(rt)
  {
    this.uniforms.blurTexture3.value = rt;
  }

  set_RT_3(rt)
  {
    this.uniforms.blurTexture4.value = rt;
  }

  set_RT_4(rt)
  {
    this.uniforms.blurTexture5.value = rt;
  }

  set_bloom_strength(value)
  {
    this.uniforms.bloomStrength.value = value;
  }

  set_bloom_radius(value)
  {
    this.uniforms.bloomRadius.value = value;
  }

  set_tint_color_0(col_string)
  {
    this.uniforms.bloomTintColors.value[0].set(col_string);
  }

  set_tint_color_1(col_string)
  {
    this.uniforms.bloomTintColors.value[1].set(col_string);
  }

  set_tint_color_2(col_string)
  {
    this.uniforms.bloomTintColors.value[2].set(col_string);
  }

  set_tint_color_3(col_string)
  {
    this.uniforms.bloomTintColors.value[3].set(col_string);
  }

  set_tint_color_4(col_string)
  {
    this.uniforms.bloomTintColors.value[4].set(col_string);
  }
}

export { UnrealBloomComposeMaterial };
