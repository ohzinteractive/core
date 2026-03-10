import frag from '../shaders/copy/copy.frag';
import vert from '../shaders/copy/copy.vert';

import { AlwaysDepth, NoBlending, ShaderMaterial, Vector2 } from 'three';

class BlitMaterial extends ShaderMaterial
{
  constructor(frag_shader?: string, vert_shader?: string, defines?: Record<string, any>)
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

export { BlitMaterial };
