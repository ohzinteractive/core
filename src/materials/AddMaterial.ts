import { BlitNodeMaterial } from './BlitNodeMaterial';

import { Texture } from 'three';
import { texture } from 'three/tsl';

// Outputs _MainTex plus _SecondTex.
// use_half_float is kept for API compatibility: node materials sample and write linear
// values on every target, so it no longer changes the shader.
class AddMaterial extends BlitNodeMaterial
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(use_half_float = false)
  {
    super();

    const second_tex = texture(new Texture());
    this.uniforms._SecondTex = second_tex;

    this.fragmentNode = this.sample_main_tex().add(this.sample(second_tex));
  }

  set_add_texture(tex: Texture)
  {
    this.uniforms._SecondTex.value = tex;
  }
}

export { AddMaterial };
