import { ShaderChunk, Vector2 } from 'three';
import { BlitMaterial } from '../../materials/BlitMaterial';
import common_utils from '../../shaders/gpu_particles/common_utils.glsl';
import frag from '../../shaders/gpu_particles/update/basic_update.frag';
import { Time } from '../../Time';

class AttributeUpdateMaterial extends BlitMaterial
{
  multiplier: number;

  constructor(custom_frag?: string)
  {
    // @ts-expect-error -- IGNORE --
    ShaderChunk.gpu_particles_utils = common_utils;

    super(custom_frag || frag);
    this.uniforms._Time = { value: new Vector2() };
    this.multiplier = 0;
  }

  update()
  {
    (this.uniforms._Time.value as Vector2).x = Time.delta_time;
    (this.uniforms._Time.value as Vector2).y += Time.delta_time;
    // this.precision = "lowp";
  }

  set_multiplier(val: number)
  {
    console.log(val);
    this.multiplier = val;
  }
}

export { AttributeUpdateMaterial };
