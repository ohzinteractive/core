import frag from 'js/core/shaders/anti_aliasing/fxaa.frag';
import { BlitMaterial } from './BlitMaterial';

class FXAAMaterial extends BlitMaterial
{
  constructor()
  {
    super(frag);
  }
}

export { FXAAMaterial };
