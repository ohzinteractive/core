import GeometryEdgeVisualizer from '/GeometryEdgeVisualizer';

import * as THREE from 'three';

export default class Shape3D extends THREE.Mesh
{
  constructor(points_2D, show_edges, height)
  {
    let shape = new THREE.Shape(points_2D);
    height = height || 1;

    let extrudeSettings = {
      steps: 2,
      depth: height,
      bevelEnabled: false,
      bevelThickness: 1,
      bevelSize: 1,
      bevelSegments: 1
    };

    let geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
    geometry.rotateX(3.14 / 2);
    geometry.translate(0, height, 0);

    let material = new THREE.MeshNormalMaterial({ color: 0xff0000 });
    super(geometry, material);

    if (show_edges)
    {
      let edge_mesh = new GeometryEdgeVisualizer(geometry, '#FF0000');
      edge_mesh.hide_faces();
      this.add(edge_mesh);
    }
  }
}
