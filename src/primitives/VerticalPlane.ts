// @ts-check
import { Material, Mesh } from 'three'; // eslint-disable-line no-unused-vars
import { PlaneGeometry } from 'three';
import { MeshBasicMaterial } from 'three';

class VerticalPlane extends Mesh
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
    super(geometry, material);
  }
}

export { VerticalPlane };
