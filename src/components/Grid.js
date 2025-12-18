// @ts-check
import { MeshBasicNodeMaterial } from 'three/webgpu';
import { createGridShader } from '../shaders/grid/grid.tsl.js';
import { GeometryUtilities } from '../utilities/GeometryUtilities';

import { Mesh, PlaneGeometry } from 'three';

class Grid extends Mesh
{
  constructor()
  {
    const { colorNode, opacityNode } = createGridShader('#4a4a4a');

    const material = new MeshBasicNodeMaterial({
      transparent: true,
      depthWrite: false
    });

    material.colorNode = colorNode;
    material.opacityNode = opacityNode;

    const plane_geometry = new PlaneGeometry(100, 100, 100, 100);

    const non_indexed_geometry = GeometryUtilities.convert_to_non_indexed_geometry(plane_geometry);

    super(non_indexed_geometry, material);

    this.rotation.x = -3.14 / 2;
  }
}

export { Grid };
