import { CustomBlending, OneFactor, Texture } from 'three';
import { texture, uniform } from 'three/tsl';
import { BlitNodeMaterial } from './BlitNodeMaterial';

// Adds the blurred image on top of _MainTex. With alpha_blending it outputs only the
// blur and relies on additive blending against whatever is already in the target.
class BloomComposeMaterial extends BlitNodeMaterial
{
  constructor(alpha_blending: boolean = false)
  {
    super();

    const blurred_tex = texture(new Texture());
    const bloom_strength = uniform(1);

    this.uniforms._BlurredTex = blurred_tex;
    this.uniforms._BloomStrength = bloom_strength;

    const blur = this.sample(blurred_tex);

    if (alpha_blending)
    {
      this.fragmentNode = blur;

      this.blending  = CustomBlending;
      this.blendSrc  = OneFactor;
      this.blendDst  = OneFactor;
    }
    else
    {
      this.fragmentNode = this.sample_main_tex().add(blur.mul(bloom_strength));
    }
  }
}

export { BloomComposeMaterial };
