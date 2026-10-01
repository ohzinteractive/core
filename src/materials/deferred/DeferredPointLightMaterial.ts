import type { RenderTarget } from 'three';
import { AdditiveBlending, BackSide, Matrix4, Texture } from 'three';
import { dot, modelViewPosition, normalize, saturate, screenUV, texture, uniform, vec2, vec4 } from 'three/tsl';
import { NodeMaterial } from 'three/webgpu';

import { decode_float_rg, decode_normal } from './depth_normal_encoding';

// Light volume of a deferred point light. Drawn on a sphere around the light, it
// shades the pixels it covers from the albedo and the depth and normals buffers.
class DeferredPointLightMaterial extends NodeMaterial
{
  uniforms: {
    _Intensity: { value: number },
    _AlbedoTex: { value: Texture },
    _NormalDepthTex: { value: Texture },
    _InverseProjMatrix: { value: Matrix4 }
  };

  constructor(intensity = 1)
  {
    super();

    const intensity_node = uniform(intensity);
    const albedo_tex = texture(new Texture());
    const normal_depth_tex = texture(new Texture());
    const inverse_proj = uniform(new Matrix4());

    this.uniforms = {
      _Intensity: intensity_node,
      _AlbedoTex: albedo_tex,
      _NormalDepthTex: normal_depth_tex,
      _InverseProjMatrix: inverse_proj
    };

    // screenUV has a top left origin on both backends, and texture() flips
    // render targets to match, so the buffers line up with the light volume.
    const ndc = vec2(screenUV.x.mul(2).sub(1), screenUV.y.mul(-2).add(1));
    const far_plane_ray = inverse_proj.mul(vec4(ndc, 1, 1));

    const depth_normal = normal_depth_tex.sample(screenUV);
    const frag_pos = far_plane_ray.xyz.div(far_plane_ray.w).mul(decode_float_rg(depth_normal.xy));
    const normal = normalize(decode_normal(depth_normal.zw));
    const albedo = albedo_tex.sample(screenUV).rgb;

    const to_light = modelViewPosition.sub(frag_pos);
    const diffuse = saturate(dot(normal, normalize(to_light)));
    const attenuation = intensity_node.div(dot(to_light, to_light));

    this.colorNode = vec4(albedo.mul(diffuse).mul(attenuation), 1);

    this.blending = AdditiveBlending;
    this.depthWrite = false;
    this.side = BackSide;
  }

  set_inverse_proj_matrix(mat4: Matrix4)
  {
    this.uniforms._InverseProjMatrix.value.copy(mat4);
  }

  set_normal_depth_rt(rt: RenderTarget)
  {
    this.uniforms._NormalDepthTex.value = rt.texture;
  }

  set_albedo_rt(rt: RenderTarget)
  {
    this.uniforms._AlbedoTex.value = rt.texture;
  }
}

export { DeferredPointLightMaterial };
