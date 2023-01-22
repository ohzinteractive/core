import { BlitMaterial } from '../materials/BlitMaterial';

import frag from '../shaders/unreal_blur/unreal_blur.frag';

import { Vector2 } from 'three';

class UnrealBlurMaterial extends BlitMaterial
{
  constructor(kernel_radius)
  {
    const defines = {
      KERNEL_RADIUS: kernel_radius,
      SIGMA: kernel_radius
    };
    super(frag, undefined, defines);
    this.uniforms._SampleDir = { value: new Vector2(0.5, 0.5) };
  }
}

export { UnrealBlurMaterial };
