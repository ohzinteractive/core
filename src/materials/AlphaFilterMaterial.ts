import { BlitMaterial } from './BlitMaterial';

import frag from '../shaders/dual_filter_blur/alpha_filter.frag';

class AlphaFilterMaterial extends BlitMaterial
{
  constructor()
  {
    super(frag);
  }

  set offset(value)
  {
    this.uniforms._Offset.value = value;
  }
  
  get offset()
  {
    return this.uniforms._Offset.value;
  }
}

export { AlphaFilterMaterial };
