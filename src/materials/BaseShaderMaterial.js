import basic_vert from '../shaders/basic_color/basic_color.vert';
import basic_frag from '../shaders/basic_color/basic_color.frag';

import * as THREE from 'three';

export default class BaseShaderMaterial extends THREE.ShaderMaterial
{
  constructor(vert, frag, uniforms)
  {
    super({
      vertexShader: vert   || basic_vert,
      fragmentShader: frag || basic_frag,
      uniforms: uniforms   || {
        _Color: { value: new THREE.Color('#FF0000') }
      }
    });
  }
}
