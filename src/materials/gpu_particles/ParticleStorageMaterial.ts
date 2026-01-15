import frag from '../../shaders/gpu_particles/generic_storage.frag';

import { AlwaysDepth, NoBlending, ShaderMaterial } from 'three';

class ParticleStorageMaterial extends ShaderMaterial
{
  constructor(vert?: string)
  {
    vert = vert || `
      varying vec4 value;
      attribute vec4 data;

      void main()
      {
          gl_Position = vec4(position.xy * 2.0 - 1.0, 1.0,1.0);
          gl_PointSize = 1.0;

          value = data;
      }
    `;

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

export { ParticleStorageMaterial };
