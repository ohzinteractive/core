import { Mesh } from 'three';

export default class UpdatableMaterialMesh extends Mesh
{
  constructor(geometry, material)
  {
    super(geometry, material);

    let self = this;

    this.onBeforeRender = () =>
    {
      self.material.update();
    };
  }
}
