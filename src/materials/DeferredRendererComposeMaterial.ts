import { BlitMaterial } from '../materials/BlitMaterial';

import vert from '../shaders/deferred/blit_copy.vert';
import frag from '../shaders/deferred/deferred_compose.frag';

import type { RenderTarget, Texture } from 'three';
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

  set_normal_depth_rt(rt: RenderTarget)
  {
    this.uniforms._NormalDepthRT.value = rt.texture;
  }

  set_albedo_rt(tex: Texture)
  {
    this.uniforms._AlbedoRT.value = tex;
  }

  set_proj_matrix(mat4: Matrix4)
  {
    this.uniforms._InverseProjMatrix.value = mat4.clone().invert();
  }
}

export { DeferredRendererComposeMaterial };
