import frag from '../shaders/copy/copy.frag';
import vert from '../shaders/copy/copy.vert';

import { AlwaysDepth, NoBlending, ShaderMaterial, Texture, Vector2 } from 'three';

class BlitMaterial extends ShaderMaterial
{
  uniforms = {
    _MainTex: { value: Texture },
    _Resolution: { value: Vector2 },
    _TargetResolution: { value: Vector2 }
  };

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
