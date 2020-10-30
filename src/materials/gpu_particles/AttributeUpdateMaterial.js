import BlitMaterial from '../../materials/BlitMaterial';
import frag from '../../shaders/gpu_particles/update/basic_update.frag';
import Time from '../../Time';

import common_utils from '../../shaders/gpu_particles/common_utils';

import { Vector2 } from 'three';
import { ShaderChunk } from 'three';

export default class AttributeUpdateMaterial extends BlitMaterial
{
  constructor(custom_frag)
  {
    ShaderChunk.gpu_particles_utils = common_utils;

    super(custom_frag || frag);
    this.uniforms._Time = { value: new Vector2() };
    this.multiplier = 0;
  }

  update()
  {
    this.uniforms._Time.value.x = Time.delta_time;
    this.uniforms._Time.value.y += Time.delta_time;
    // this.precision = "lowp";
  }

  set_multiplier(val)
  {
    console.log(val);
    this.multiplier = val;
  }
}
