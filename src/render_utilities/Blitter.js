import { BlitMaterial } from '../materials/BlitMaterial';

import { Scene } from 'three';
import { Mesh } from 'three';
import { PlaneGeometry } from 'three';
import { OrthographicCamera } from 'three';

class Blitter
{
  constructor(renderer)
  {
    this.renderer = renderer;
    this._blit_scene = new Scene();
    this._blit_material = new BlitMaterial();
    this._blit_quad = new Mesh(
      new PlaneGeometry(1, 1), this._blit_material);
    this._blit_scene.add(this._blit_quad);
    this._blit_camera = new OrthographicCamera(-1, 1, 1, -1, -10000, 10000);
  }

  blit(src, dst)
  {
    this._blit_quad.material = this._blit_material;

    const src_texture = src.isWebGLRenderTarget === true ? src.texture : src;
    const src_width   = src.isWebGLRenderTarget === true ? src.width   : src.image.width;
    const src_height  = src.isWebGLRenderTarget === true ? src.height  : src.image.height;

    this._blit_quad.material.uniforms._MainTex.value = src_texture;
    this._blit_quad.material.uniforms._Resolution.value.set(src_width, src_height);

    if (dst)
    {
      this._blit_quad.material.uniforms._TargetResolution.value.set(dst.width, dst.height);
    }
    else
    {
      this.renderer.getSize(this._blit_quad.material.uniforms._TargetResolution.value);
    }

    this.__render(dst);
  }

  material_pass(mat, dst)
  {
    this._blit_quad.material = mat;
    // this._blit_quad.material.uniforms._MainTex.value = undefined;
    // this._blit_quad.material.uniforms._Resolution.value.set(1, 1);

    this.__render(dst);
  }

  blit_with_material(src, dst, mat)
  {
    const src_texture = src.isWebGLRenderTarget === true ? src.texture : src;
    const src_width   = src.isWebGLRenderTarget === true ? src.width   : src.image.width;
    const src_height  = src.isWebGLRenderTarget === true ? src.height  : src.image.height;

    this._blit_quad.material = mat;
    this._blit_quad.material.uniforms._MainTex.value = src_texture;
    this._blit_quad.material.uniforms._Resolution.value.set(src_width, src_height);

    if (dst)
    {
      this._blit_quad.material.uniforms._TargetResolution.value.set(dst.width, dst.height);
    }
    else
    {
      this.renderer.getSize(this._blit_quad.material.uniforms._TargetResolution.value);
    }

    this.__render(dst);
  }

  blit_clear_with_material(dst_RT, mat)
  {
    this._blit_quad.material = mat;

    this.__render(dst_RT);
  }

  dispose()
  {
    this._blit_quad.geometry.dispose();
    this._blit_quad.material.dispose();
  }

  __render(RT)
  {
    RT = RT === undefined ? null : RT;

    const current_rt = this.renderer.getRenderTarget();

    this.renderer.setRenderTarget(RT === undefined ? null : RT);
    this.renderer.render(this._blit_scene, this._blit_camera);

    this.renderer.setRenderTarget(current_rt);
  }
}

export { Blitter };
