import vert from '../../shaders/deferred/point_light.vert';
import frag from '../../shaders/deferred/point_light.frag';

import { BaseShaderMaterial } from '../../materials/BaseShaderMaterial';

import { Matrix4 } from 'three';
import { AdditiveBlending } from 'three';
import { BackSide } from 'three';

class DeferredPointLightMaterial extends BaseShaderMaterial
{
  constructor(intensity = 1)
  {
    super(vert, frag, {
      _Intensity: { value: intensity },
      _AlbedoTex: { value: undefined },
      _NormalDepthTex: { value: undefined },
      _InverseProjMatrix: { value: new Matrix4() }
    });

    this.blending = AdditiveBlending;
    this.depthWrite = false;
    this.side = BackSide;
  }

  set_inverse_proj_matrix(mat4)
  {
    this.uniforms._InverseProjMatrix.value.copy(mat4);
  }

  set_normal_depth_rt(rt)
  {
    this.uniforms._NormalDepthTex.value = rt.texture;
  }

  set_albedo_rt(rt)
  {
    this.uniforms._AlbedoTex.value = rt.texture;
  }
}

export { DeferredPointLightMaterial };
