import BlitMaterial from './BlitMaterial';
import frag from '../shaders/bloom/bloom_compose_frag';
import cheap_frag from '../shaders/bloom/cheap_bloom_compose_frag';
import { CustomBlending, OneFactor } from 'three';

export default class BloomComposeMaterial extends BlitMaterial
{
  constructor(alpha_blending)
  {
    super(alpha_blending ? cheap_frag : frag);
    this.uniforms._MainTex        = { value: undefined };
    this.uniforms._BlurredTex     = { value: undefined };
    this.uniforms._BloomStrength  = { value: 1 };

    if (alpha_blending)
    {
      this.blending  = CustomBlending;
      this.blendSrc  = OneFactor;
      this.blendDst  = OneFactor;
    }
  }
}
