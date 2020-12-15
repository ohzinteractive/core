import BlitMaterial from 'js/core/materials/BlitMaterial';
import downsample_frag from 'js/core/shaders/dual_filter_blur/downsample_frag';
import upsample_frag from 'js/core/shaders/dual_filter_blur/upsample_frag';

export default class DualFilteringBlurMaterial extends BlitMaterial
{
  constructor(upsample)
  {
    super(upsample ? upsample_frag : downsample_frag);
  }
}
