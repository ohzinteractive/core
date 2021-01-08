
import { Vector3, Mesh } from 'three';
import { BoxGeometry } from 'three';
import { MeshBasicMaterial } from 'three';

export default class Cube extends Mesh
{
  constructor(size, segments, color)
  {
    size     = size || new Vector3(1, 1, 1);
    segments = segments || new Vector3(1, 1, 1);
    color    = color || 0xff0000;
    let geometry = new BoxGeometry(size.x, size.y, size.z, segments.x, segments.y, segments.z);
    let material = new MeshBasicMaterial({ color: color });
    super(geometry, material);
  }
}
