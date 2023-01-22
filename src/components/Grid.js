import grid_frag from '../shaders/grid/grid.frag';
import grid_vert from '../shaders/grid/grid.vert';

import { GeometryUtilities } from '../utilities/GeometryUtilities';

import { Mesh } from 'three';
import { ShaderMaterial } from 'three';
import { Color } from 'three';
import { PlaneGeometry } from 'three';

class Grid extends Mesh
{
  constructor()
  {
    const material = new ShaderMaterial({
      uniforms: {
        _Color: { value: new Color('#919191') }
      },
      vertexShader: grid_vert,
      fragmentShader: grid_frag,
      extensions: { derivatives: true },
      transparent: true,
      depthWrite: false
    });

    const plane_geometry = new PlaneGeometry(100, 100, 100, 100);

    const non_indexed_geometry = GeometryUtilities.convert_to_non_indexed_geometry(plane_geometry);

    super(non_indexed_geometry, material);

    this.rotation.x = -3.14 / 2;
  }
}

export { Grid };
