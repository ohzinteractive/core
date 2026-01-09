import frag from '../../shaders/gpu_particles/visualize/visualize.frag';
import vert from '../../shaders/gpu_particles/visualize/visualize.vert';

import { ShaderMaterial } from 'three';

class BasicParticleMaterial extends ShaderMaterial
{
  constructor()
  {
    // ShaderChunk["gpu_particles_utils"] = common_utils;

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

export { BasicParticleMaterial };
