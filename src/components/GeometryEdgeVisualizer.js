import edge_visualizer_frag from '../shaders/edge_visualizer/edge_visualizer.frag';
import edge_visualizer_vert from '../shaders/edge_visualizer/edge_visualizer.vert';
import GeometryUtilities from '../utilities/GeometryUtilities';

import { Mesh } from 'three';
import { Color } from 'three';
import { ShaderMaterial } from 'three';

export default class GeometryEdgeVisualizer extends Mesh
{
  constructor(geometry, line_color)
  {
    line_color = line_color || '#91EE91';

    let material = new ShaderMaterial({
      uniforms: {
        _Color: { value: new Color('#CC3333') },
        _LineColor: { value: new Color(line_color) },
        _Alpha: { value: 1 },
        _DepthOffset: { value: 0.001 },
        _Thickness: { value: 2.5 }
      },
      vertexShader: edge_visualizer_vert,
      fragmentShader: edge_visualizer_frag,
      extensions: { derivatives: true },
      transparent: true,
      depthWrite: false
    });

    let non_indexed_geometry = geometry;
    if (non_indexed_geometry.index)
    {
      non_indexed_geometry = GeometryUtilities.convert_to_non_indexed_geometry(geometry);
    }

    GeometryUtilities.add_barycentric_attribute(non_indexed_geometry);

    super(non_indexed_geometry, material);
  }

  hide_faces()
  {
    this.material.uniforms._Alpha.value = 0;
  }
}
