import { BlitMaterial } from './BlitMaterial';

import frag from '../shaders/add/add.frag';

class AddMaterial extends BlitMaterial
{
  constructor(nMips)
  {
    super(frag);

    this.uniforms._SecondTex = { value: undefined };
  }

  set_add_texture(tex)
  {
    this.uniforms._SecondTex.value = tex;
  }
}

export { AddMaterial };
