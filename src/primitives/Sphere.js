import { Mesh } from 'three';
import { SphereBufferGeometry } from 'three';
import { MeshBasicMaterial } from 'three';

export default class Sphere extends Mesh
{
  constructor(radius, color)
  {
    color = color || '#FF0000';
    radius = radius || 1;
    let geometry = new SphereBufferGeometry(radius, 64, 64);
    let material = new MeshBasicMaterial({ color: color });
    super(geometry, material);
  }
}
