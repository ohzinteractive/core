import GeometryEdgeVisualizer from './GeometryEdgeVisualizer';

import { Mesh } from 'three';
import { Shape } from 'three';
import { ExtrudeBufferGeometry } from 'three';
import { MeshNormalMaterial } from 'three';

export default class Shape3D extends Mesh
{
  constructor(points_2D, show_edges, height)
  {
    let shape = new Shape(points_2D);
    height = height || 1;

    let extrudeSettings = {
      steps: 2,
      depth: height,
      bevelEnabled: false,
      bevelThickness: 1,
      bevelSize: 1,
      bevelSegments: 1
    };

    let geometry = new ExtrudeBufferGeometry(shape, extrudeSettings);
    geometry.rotateX(3.14 / 2);
    geometry.translate(0, height, 0);

    let material = new MeshNormalMaterial({ color: 0xff0000 });
    super(geometry, material);

    if (show_edges)
    {
      let edge_mesh = new GeometryEdgeVisualizer(geometry, '#FF0000');
      edge_mesh.hide_faces();
      this.add(edge_mesh);
    }
  }
}
