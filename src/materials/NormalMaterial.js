import frag from '../shaders/normal/normal.frag';
import vert from '../shaders/normal/normal.vert';

import { ShaderMaterial } from 'three';

export default class NormalMaterial extends ShaderMaterial
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
