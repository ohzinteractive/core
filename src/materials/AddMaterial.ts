import { BlitMaterial } from './BlitMaterial';

import type { Texture } from 'three';
import frag from '../shaders/add/add.frag';

class AddMaterial extends BlitMaterial
{
  constructor(use_half_float = false)
  {
    super(frag);
    this.defines.USE_LINEAR_COLOR_SPACE = use_half_float;
    this.uniforms._SecondTex = { value: undefined };
  }

  set_add_texture(tex: Texture)
  {
    this.uniforms._SecondTex.value = tex;
  }
}

export { AddMaterial };
