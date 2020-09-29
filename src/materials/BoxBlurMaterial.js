import BlitMaterial from '../materials/BlitMaterial';
import frag from '../shaders/box_blur/box_blur.frag';

import { Vector2 } from 'three';

export default class BoxBlurMaterial extends BlitMaterial
{
  constructor()
  {
    super(frag);
    this.uniforms._SampleDir = { value: new Vector2() };
  }
}
