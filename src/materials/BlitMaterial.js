import vert from '../shaders/copy/copy.vert';
import frag from '../shaders/copy/copy.frag';

import { ShaderMaterial } from 'three';
import { Vector2 } from 'three';
import { NoBlending } from 'three';
import { AlwaysDepth } from 'three';

export default class BlitMaterial extends ShaderMaterial
{
  constructor(frag_shader, vert_shader, defines)
  {
    super({
      uniforms: {
        _MainTex: { value: null },
        _Resolution: { value: new Vector2(0, 0) },
        _TargetResolution: { value: new Vector2(0, 0) }
      },
      defines: defines || {},
      vertexShader: vert_shader || vert,
      fragmentShader: frag_shader || frag,
      depthWrite: false,
      blending: NoBlending,
      depthTest: false,
      depthFunc: AlwaysDepth
    });
  }
}
