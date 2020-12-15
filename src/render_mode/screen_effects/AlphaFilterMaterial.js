import BlitMaterial from 'js/core/materials/BlitMaterial';
import frag from 'js/core/shaders/dual_filter_blur/alpha_filter';

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
