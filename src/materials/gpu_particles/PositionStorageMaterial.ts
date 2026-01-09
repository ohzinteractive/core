import { ParticleStorageMaterial } from '../../materials/gpu_particles/ParticleStorageMaterial';

class PositionStorageMaterial extends ParticleStorageMaterial
{
  constructor()
  {
    const vert = `

      varying vec4 value;

      attribute vec2 storage_uv;

      void main()
      {
          gl_Position = vec4(storage_uv * 2.0 - 1.0, 1.0,1.0);
          gl_PointSize = 1.0;

          value = vec4(position.xyz, 1.0);
      }

    `;
    
    super(vert);
  }
}

export { PositionStorageMaterial };
