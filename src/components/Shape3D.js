// @ts-check
import { GeometryEdgeVisualizer } from './GeometryEdgeVisualizer';

import { Mesh, Vector2 } from 'three'; // eslint-disable-line no-unused-vars
import { Shape } from 'three';
import { ExtrudeGeometry } from 'three';
import { MeshNormalMaterial } from 'three';

class Shape3D extends Mesh
{
  /**
   * @param {Vector2[]} points_2D
   * @param {boolean} show_edges
   * @param {number} [height]
   */
  constructor(points_2D, show_edges, height)
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
