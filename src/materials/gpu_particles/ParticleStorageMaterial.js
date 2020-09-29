import frag from '../../shaders/gpu_particles/generic_storage.frag';
import common_utils from '../../shaders/gpu_particles/common_utils.glsl';

import * as THREE from 'three';

export default class ParticleStorageMaterial extends THREE.ShaderMaterial
{
  constructor(vert)
  {
    THREE.ShaderChunk.gpu_particles_utils = common_utils;

    super({
      uniforms: {

      },
      vertexShader: vert,
      fragmentShader: frag,
      depthWrite: false,
      blending: THREE.NoBlending,
      depthTest: false,
      depthFunc: THREE.AlwaysDepth
    });
  }
}
