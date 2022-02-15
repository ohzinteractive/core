import { Mesh } from 'three';
import { PlaneBufferGeometry } from 'three';
import { MeshBasicMaterial } from 'three';

export default class VerticalPlane extends Mesh
{
  constructor(width, height, color, material)
  {
    width = width || 1;
    height = height || 1;
    color = color || '#FF0000';
    material = material || new MeshBasicMaterial({ color: color });

    const geometry = new PlaneBufferGeometry(width, height);
    super(geometry, material);
  }
}
