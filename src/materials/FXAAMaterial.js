import BlitMaterial from 'js/core/materials/BlitMaterial';
import frag from 'js/core/shaders/anti_aliasing/fxaa_frag';

export default class FXAAMaterial extends BlitMaterial
{
  constructor(upsample)
  {
    super(frag);
  }
}
