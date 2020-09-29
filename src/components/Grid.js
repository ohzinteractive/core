import grid_frag from '../shaders/grid/grid.frag';
import grid_vert from '../shaders/grid/grid.vert';
import GeometryUtilities from '../utilities/GeometryUtilities';

import { Mesh } from 'three';
import { ShaderMaterial } from 'three';
import { Color } from 'three';
import { PlaneBufferGeometry } from 'three';

export default class Grid extends Mesh
{
  constructor()
  {
    let material = new ShaderMaterial({
      uniforms: {
        _Color: { value: new Color('#919191') }
      },
      vertexShader: grid_vert,
      fragmentShader: grid_frag,
      extensions: { derivatives: true },
      transparent: true,
      depthWrite: false
    });

    let plane_geometry = new PlaneBufferGeometry(100, 100, 100, 100);

    let non_indexed_geometry = GeometryUtilities.convert_to_non_indexed_geometry(plane_geometry);

    super(non_indexed_geometry, material);

    this.rotation.x = -3.14 / 2;
  }
}
