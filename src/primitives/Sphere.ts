import type { Vector3 } from 'three';
import { Mesh, MeshBasicMaterial, SphereGeometry } from 'three';

class Sphere extends Mesh
{
  center: Vector3;
  color: string | number;
  radius: number;

  constructor(radius: number, color: number | string)
  {
    color = color || '#FF0000';
    radius = radius || 1;
    const geometry = new SphereGeometry(radius, 64, 64);
    const material = new MeshBasicMaterial({ color: color });
    super(geometry, material);
    this.radius = radius;
    this.color = color;
    this.center = this.position;
  }
}

export { Sphere };
