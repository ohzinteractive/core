import { GeometryEdgeVisualizer } from './GeometryEdgeVisualizer';

import type { Vector2 } from 'three';
import { ExtrudeGeometry, Mesh, MeshNormalMaterial, Shape } from 'three';

class Shape3D extends Mesh
{
  constructor(points_2D: Vector2[], show_edges: boolean, height?: number)
  {
    const shape = new Shape(points_2D);
    height = height || 1;

    const extrudeSettings = {
      steps: 2,
      depth: height,
      bevelEnabled: false,
      bevelThickness: 1,
      bevelSize: 1,
      bevelSegments: 1
    };

    const geometry = new ExtrudeGeometry(shape, extrudeSettings);
    geometry.rotateX(3.14 / 2);
    geometry.translate(0, height, 0);

    const material = new MeshNormalMaterial();
    super(geometry, material);

    if (show_edges)
    {
      const edge_mesh = new GeometryEdgeVisualizer(geometry, '#FF0000');
      edge_mesh.hide_faces();
      this.add(edge_mesh);
    }
  }
}

export { Shape3D };
