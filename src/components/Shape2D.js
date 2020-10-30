import GeometryEdgeVisualizer from './GeometryEdgeVisualizer';

import { Mesh } from 'three';
import { Shape } from 'three';
import { ShapeBufferGeometry } from 'three';
import { MeshBasicMaterial } from 'three';

export default class Shape2D extends Mesh
{
  constructor(points_2D, show_edges)
  {
    let shape = new Shape(points_2D);
    let geometry = new ShapeBufferGeometry(shape);
    geometry.rotateX(3.14 / 2);

    let material = new MeshBasicMaterial({ color: 0xff0000 });
    super(geometry, material);
    this.invert_normals(geometry);

    if (show_edges)
    {
      let edge_mesh = new GeometryEdgeVisualizer(geometry);
      edge_mesh.hide_faces();
      edge_mesh.material.depthTest = false;
      this.add(edge_mesh);
    }
  }

  invert_normals(geometry)
  {
    let indices = geometry.index.array;
    for (let i = 0; i < indices.length; i += 3)
    {
      let x = indices[i + 0];
      let z = indices[i + 2];

      indices[i + 0] = z;
      indices[i + 2] = x;
    }
    geometry.computeVertexNormals();
  }
}
