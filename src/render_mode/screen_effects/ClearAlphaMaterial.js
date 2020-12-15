import BlitMaterial from 'js/core/materials/BlitMaterial';
import frag from 'js/core/shaders/clear/clear_alpha';

export default class ClearAlphaMaterial extends BlitMaterial
{
  constructor()
  {
    super(frag);

    this.blending = THREE.SubtractiveBlending;
  }
}
