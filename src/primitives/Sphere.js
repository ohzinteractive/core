import { Mesh } from 'three';
import { SphereBufferGeometry } from 'three';
import { MeshBasicMaterial } from 'three';

class Sphere extends Mesh
{
  constructor(radius, color)
  {
    color = color || '#FF0000';
    radius = radius || 1;
    const geometry = new SphereBufferGeometry(radius, 64, 64);
    const material = new MeshBasicMaterial({ color: color });
    super(geometry, material);
  }
}

export { Sphere };
