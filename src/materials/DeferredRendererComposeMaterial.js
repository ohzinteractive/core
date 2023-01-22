import { BlitMaterial } from '../materials/BlitMaterial';

import frag from '../shaders/deferred/deferred_compose.frag';
import vert from '../shaders/deferred/blit_copy.vert';

import { Matrix4 } from 'three';

class DeferredRendererComposeMaterial extends BlitMaterial
{
  constructor()
  {
    super(frag, vert);

    this.uniforms._NormalDepthRT = { value: undefined };
    this.uniforms._AlbedoRT = { value: undefined };
    this.uniforms._InverseProjMatrix = { value: new Matrix4() };
  }

  set_normal_depth_rt(rt)
  {
    this.uniforms._NormalDepthRT.value = rt.texture;
  }

  set_albedo_rt(tex)
  {
    this.uniforms._AlbedoRT.value = tex;
  }

  set_proj_matrix(mat4)
  {
    this.uniforms._InverseProjMatrix.value.getInverse(mat4);
  }
}

export { DeferredRendererComposeMaterial };
