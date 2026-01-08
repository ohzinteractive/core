import { Mesh, MeshBasicMaterial, SphereGeometry } from 'three';

class Sphere extends Mesh
{
  /**
   * @param {number} radius
   * @param {number | string} color
   */
  constructor(radius, color)
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
