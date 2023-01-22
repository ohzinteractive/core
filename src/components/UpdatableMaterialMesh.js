import { Mesh } from 'three';

class UpdatableMaterialMesh extends Mesh
{
  constructor(geometry, material)
  {
    super(geometry, material);

    const self = this;

    this.onBeforeRender = () =>
    {
      self.material.update();
    };
  }
}

export { UpdatableMaterialMesh };
