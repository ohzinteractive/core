import ParticleAttribute from '../gpu_particles/ParticleAttribute';
import PositionStorageMaterial from '../materials/gpu_particles/PositionStorageMaterial';

export default class ParticlePositionAttribute extends ParticleAttribute
{
  constructor()
  {
    super('_Position');
  }

  init_from_geometry(geometry)
  {
    let pos_attr = geometry.getAttribute('position');
    this.read    = this.build_RT(pos_attr.count);
    this.write   = this.build_RT(pos_attr.count);

    let mat = new PositionStorageMaterial();
    this.render_geometry_to_RT(geometry, mat, this.read);
  }
}
