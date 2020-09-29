import vert from '../../shaders/gpu_particles/visualize/visualize.vert';
import frag from '../../shaders/gpu_particles/visualize/visualize.frag';

import * as THREE from 'three';

export default class BasicParticleMaterial extends THREE.ShaderMaterial
{
  constructor()
  {
    // THREE.ShaderChunk["gpu_particles_utils"] = common_utils;

    super({
      uniforms: {
        _Position: { value: undefined },
        _Time: { value: 0 }
      },
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false
    });
  }
}
