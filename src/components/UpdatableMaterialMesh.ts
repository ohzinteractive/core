// @ts-check
import { BufferGeometry, Material, Mesh } from 'three'; // eslint-disable-line no-unused-vars

class UpdatableMaterialMesh extends Mesh
{
  /**
   * @param {BufferGeometry} geometry
   * @param {Material} material
   */
  constructor(geometry, material)
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
