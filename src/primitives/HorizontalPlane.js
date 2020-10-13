import { Mesh } from 'three';
import { MeshBasicMaterial } from 'three';
import { PlaneBufferGeometry } from 'three';

export default class HorizontalPlane extends Mesh
{
  constructor(width, height, color, material)
  {
    width = width || 1;
    height = height || 1;
    color = color || '#FF0000';
    material = material || new MeshBasicMaterial({ color: color });

    let geometry = new PlaneBufferGeometry(width, height);
    geometry.rotateX(-3.14 / 2);
    super(geometry, material);
  }
}
