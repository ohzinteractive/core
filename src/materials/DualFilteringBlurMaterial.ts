import { BlitMaterial } from './BlitMaterial';

import downsample_frag from '../shaders/dual_filter_blur/downsample.frag';
import upsample_frag from '../shaders/dual_filter_blur/upsample.frag';

class DualFilteringBlurMaterial extends BlitMaterial
{
  constructor(upsample: any)
  {
    super(upsample ? upsample_frag : downsample_frag);
  }
}

export { DualFilteringBlurMaterial };
