import type { Material } from 'three';
import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';

class HorizontalPlane extends Mesh
{
  constructor(width?: number, height?: number, color?: number | string, material?: Material)
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
