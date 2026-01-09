import basic_frag from '../shaders/basic_color/basic_color.frag';
import basic_vert from '../shaders/basic_color/basic_color.vert';

import { Color, ShaderMaterial } from 'three';

class BaseShaderMaterial extends ShaderMaterial
{
  constructor(vert: any, frag: any, uniforms: any)
  {
    super({
      vertexShader: vert   || basic_vert,
      fragmentShader: frag || basic_frag,
      uniforms: uniforms   || {
        _Color: { value: new Color('#FF0000') }
      }
    });
  }
}

export { BaseShaderMaterial };
