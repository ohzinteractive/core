// @ts-check
import { Vector3, Mesh } from 'three';
import { BoxGeometry } from 'three';
import { MeshBasicMaterial } from 'three';

class Cube extends Mesh
{
  /**
   * @param {Vector3} [size]
   * @param {Vector3} [segments]
   * @param {number | string} [color]
   */
  constructor(size, segments, color)
  {
    size     = size || new Vector3(1, 1, 1);
    segments = segments || new Vector3(1, 1, 1);
    color    = color || 0xff0000;
    const geometry = new BoxGeometry(size.x, size.y, size.z, segments.x, segments.y, segments.z);
    const material = new MeshBasicMaterial({ color: color });
    super(geometry, material);
  }
}

export { Cube };
