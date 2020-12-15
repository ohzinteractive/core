import BlitMaterial from 'js/core/materials/BlitMaterial';
import frag from 'js/core/shaders/clear/clear_alpha';
import { SubtractiveBlending } from 'three';

export default class ClearAlphaMaterial extends BlitMaterial
{
  constructor()
  {
    super(frag);

    this.blending = SubtractiveBlending;
  }
}
