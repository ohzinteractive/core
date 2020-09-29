import frag from '../../shaders/gpu_particles/generic_storage.frag';
import common_utils from '../../shaders/gpu_particles/common_utils.glsl';

import { ShaderMaterial } from 'three';
import { ShaderChunk } from 'three';
import { NoBlending } from 'three';
import { AlwaysDepth } from 'three';

export default class ParticleStorageMaterial extends ShaderMaterial
{
  constructor(vert)
  {
    ShaderChunk.gpu_particles_utils = common_utils;

    super({
      uniforms: {

      },
      vertexShader: vert,
      fragmentShader: frag,
      depthWrite: false,
      blending: NoBlending,
      depthTest: false,
      depthFunc: AlwaysDepth
    });
  }
}
