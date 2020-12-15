import BlitMaterial from './BlitMaterial';
import frag from '../shaders/dual_filter_blur/alpha_filter';

export default class AlphaFilterMaterial extends BlitMaterial
{
  constructor(use_alpha_mask, upsample)
  {
    super(frag);
  }

  set offset(value)
  {
    this.uniforms._Offset.value = value;
  }
}
