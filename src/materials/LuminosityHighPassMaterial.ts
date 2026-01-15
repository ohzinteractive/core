import { BlitMaterial } from './BlitMaterial';

import frag from '../shaders/luminosity_high_pass/luminosity_high_pass.frag';

import { Color } from 'three';
class LuminosityHighPassMaterial extends BlitMaterial
{
  constructor()
  {
    super(frag);

    this.uniforms.luminosityThreshold = { value: 0.23 };
    this.uniforms.smoothWidth         = { value: 0.01 };
    this.uniforms.defaultColor        = { value: new Color('#000000') };
    this.uniforms.defaultOpacity      = { value: 0.0 };

    this.defines.USE_LINEAR_COLOR_SPACE = true;
  }

  set_threshold(value_01: number)
  {
    this.uniforms.luminosityThreshold.value = value_01;
  }
}

export { LuminosityHighPassMaterial };
