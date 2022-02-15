import GeometryEdgeVisualizer from './GeometryEdgeVisualizer';

import { Mesh } from 'three';
import { Shape } from 'three';
import { ShapeBufferGeometry } from 'three';
import { MeshBasicMaterial } from 'three';

export default class Shape2D extends Mesh
{
  constructor(points_2D, show_edges)
  {
    const shape = new Shape(points_2D);
    const geometry = new ShapeBufferGeometry(shape);
    geometry.rotateX(3.14 / 2);

    const material = new MeshBasicMaterial({ color: 0xff0000 });
    super(geometry, material);
    this.invert_normals(geometry);

    if (show_edges)
    {
      const edge_mesh = new GeometryEdgeVisualizer(geometry);
      edge_mesh.hide_faces();
      edge_mesh.material.depthTest = false;
      this.add(edge_mesh);
    }
  }

  invert_normals(geometry)
  {
    const indices = geometry.index.array;
    for (let i = 0; i < indices.length; i += 3)
    {
      const x = indices[i + 0];
      const z = indices[i + 2];

      indices[i + 0] = z;
      indices[i + 2] = x;
    }
    geometry.computeVertexNormals();
  }
}
