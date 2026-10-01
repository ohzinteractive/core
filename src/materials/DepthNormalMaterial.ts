import { NoBlending } from 'three';
import { abs, normalize, normalView, positionView, uniform, vec4 } from 'three/tsl';
import { NodeMaterial } from 'three/webgpu';

import { encode_float_rg, encode_normal } from './deferred/depth_normal_encoding';

// Scene override that writes linear depth over the far plane (RG) and the
// view space normal (BA), packed by depth_normal_encoding.
class DepthNormalMaterial extends NodeMaterial
{
  uniforms: { _FarPlane: { value: number } };

  constructor()
  {
    super();

    const far_plane = uniform(1);

    this.uniforms = { _FarPlane: far_plane };

    this.fragmentNode = vec4(
      encode_float_rg(abs(positionView.z).div(far_plane)),
      encode_normal(normalize(normalView))
    );

    // The normal lives in alpha, so it must be written as is.
    this.blending = NoBlending;
  }

  set far_plane(value: number)
  {
    this.uniforms._FarPlane.value = value;
  }

  get far_plane(): number
  {
    return this.uniforms._FarPlane.value;
  }
}

export { DepthNormalMaterial };
