import basic_vert from '../shaders/basic_color/basic_color.vert';
import basic_frag from '../shaders/basic_color/basic_color.frag';

import { ShaderMaterial } from 'three';
import { Color } from 'three';

class BaseShaderMaterial extends ShaderMaterial
{
  constructor(vert, frag, uniforms)
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
