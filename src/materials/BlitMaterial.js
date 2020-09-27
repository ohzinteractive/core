import vert from '/shaders/copy/copy_vert';
import frag from '/shaders/copy/copy_frag';

import * as THREE from 'three';

export default class BlitMaterial extends THREE.ShaderMaterial
{
  constructor(frag_shader, vert_shader, defines)
  {
    super({
      uniforms: {
        _MainTex: { value: null },
        _Resolution: { value: new THREE.Vector2(0, 0) },
        _TargetResolution: { value: new THREE.Vector2(0, 0) }
      },
      defines: defines || {},
      vertexShader: vert_shader || vert,
      fragmentShader: frag_shader || frag,
      depthWrite: false,
      blending: THREE.NoBlending,
      depthTest: false,
      depthWrite: false,
      depthFunc: THREE.AlwaysDepth
    });
  }
}
