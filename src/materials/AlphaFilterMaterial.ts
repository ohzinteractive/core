import { BlitMaterial } from './BlitMaterial';

import frag from '../shaders/dual_filter_blur/alpha_filter.frag';

export class AlphaFilterMaterial extends BlitMaterial
{
  constructor()
  {
    super(frag);
  }

  set offset(value: number)
  {
    this.uniforms._Offset.value = value;
  }
  
  get offset(): number
  {
    return this.uniforms._Offset.value as number;
  }
}
