import frag from '../shaders/normal/normal.frag';
import vert from '../shaders/normal/normal.vert';

import { ShaderMaterial } from 'three';

class NormalMaterial extends ShaderMaterial
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

export { NormalMaterial };
