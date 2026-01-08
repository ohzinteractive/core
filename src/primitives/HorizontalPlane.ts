// @ts-check
import { Material, Mesh } from 'three'; // eslint-disable-line no-unused-vars
import { MeshBasicMaterial } from 'three';
import { PlaneGeometry } from 'three';

class HorizontalPlane extends Mesh
{
  /**
   * @param {number} [width]
   * @param {number} [height]
   * @param {number | string} [color]
   * @param {Material} [material]
   */
  constructor(width, height, color, material)
  {
    width = width || 1;
    height = height || 1;
    color = color || '#FF0000';
    material = material || new MeshBasicMaterial({ color: color });

    const geometry = new PlaneGeometry(width, height);
    geometry.rotateX(-3.14 / 2);
    super(geometry, material);
  }
}

export { HorizontalPlane };
