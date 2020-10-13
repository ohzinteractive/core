import ParticleStorageMaterial from '../../materials/gpu_particles/ParticleStorageMaterial';
import vert from '../../shaders/gpu_particles/store/store_position.vert';

export default class PositionStorageMaterial extends ParticleStorageMaterial
{
  constructor()
  {
    super(vert);
  }
}
