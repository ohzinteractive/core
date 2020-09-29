import vert from '../../shaders/gpu_particles/visualize/visualize.vert';
import frag from '../../shaders/gpu_particles/visualize/visualize.frag';

import { ShaderMaterial } from 'three';

export default class BasicParticleMaterial extends ShaderMaterial
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
