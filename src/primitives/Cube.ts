import { BoxGeometry, Mesh, MeshBasicMaterial, Vector3 } from 'three';

class Cube extends Mesh
{
  constructor(size?: Vector3, segments?: Vector3, color?: number | string)
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
