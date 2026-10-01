import { BlitNodeMaterial } from '../materials/BlitNodeMaterial';

import { Texture } from 'three';
import { texture, vec4 } from 'three/tsl';

// Darkens the scene (_MainTex) by the occlusion in the red channel of _AO.
class SSAOComposeMaterial extends BlitNodeMaterial
{
  constructor()
  {
    super();

    const ao = texture(new Texture());

    this.uniforms._AO = ao;

    const occlusion = this.sample(ao).r;

    this.fragmentNode = vec4(this.sample_main_tex().rgb.mul(occlusion.oneMinus()), 1);
  }
}

export { SSAOComposeMaterial };
