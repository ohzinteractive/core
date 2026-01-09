import type { BufferGeometry, Material} from 'three';
import { Mesh } from 'three';

class UpdatableMaterialMesh extends Mesh
{
  constructor(geometry: BufferGeometry, material: Material)
  {
    super(geometry, material);
    this.material = material;
    const self = this;

    this.onBeforeRender = () =>
    {
      if ('update' in self.material && typeof self.material.update === 'function')
      {
        self.material.update();
      }
    };
  }
}

export { UpdatableMaterialMesh };
