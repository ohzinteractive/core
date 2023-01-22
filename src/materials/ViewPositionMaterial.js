import frag from '../shaders/write_view_position/write_view_position.frag';
import vert from '../shaders/write_view_position/write_view_position.vert';

import { ShaderMaterial } from 'three';

class ViewPositionMaterial extends ShaderMaterial
{
  constructor()
  {
    super({
      uniforms: {
      },
      vertexShader: vert,
      fragmentShader: frag
    });
  }
}

export { ViewPositionMaterial };
