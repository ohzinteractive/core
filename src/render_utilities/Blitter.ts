import type { Renderer } from 'three/webgpu';
import { BlitMaterial } from '../materials/BlitMaterial';

import { Mesh, OrthographicCamera, PlaneGeometry, Scene } from 'three';

class Blitter
{
  _blit_camera: OrthographicCamera;
  _blit_material: BlitMaterial;
  _blit_quad: Mesh;
  _blit_scene: Scene;
  renderer: Renderer;

  constructor(renderer: Renderer)
  {
    this.renderer = renderer;
    this._blit_scene = new Scene();
    this._blit_material = new BlitMaterial();
    this._blit_quad = new Mesh(
      new PlaneGeometry(1, 1), this._blit_material);
    this._blit_scene.add(this._blit_quad);
    this._blit_camera = new OrthographicCamera(-1, 1, 1, -1, -10000, 10000);
  }

  blit(src: any, dst: any)
  {
    this._blit_quad.material = this._blit_material;

    const src_texture = src.isRenderTarget === true ? src.texture : src;
    const src_width   = src.isRenderTarget === true ? src.width   : src.image.width;
    const src_height  = src.isRenderTarget === true ? src.height  : src.image.height;

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

  material_pass(mat: any, dst: any)
  {
    this._blit_quad.material = mat;
    // this._blit_quad.material.uniforms._MainTex.value = undefined;
    // this._blit_quad.material.uniforms._Resolution.value.set(1, 1);

    this.__render(dst);
  }

  blit_with_material(src: any, dst: any, mat: any)
  {
    const src_texture = src.isRenderTarget === true ? src.texture : src;
    const src_width   = src.isRenderTarget === true ? src.width   : src.image.width;
    const src_height  = src.isRenderTarget === true ? src.height  : src.image.height;

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

  blit_clear_with_material(dst_RT: any, mat: any)
  {
    this._blit_quad.material = mat;

    this.__render(dst_RT);
  }

  dispose()
  {
    this._blit_quad.geometry.dispose();
    this._blit_quad.material.dispose();
  }

  __render(dst_RT: any)
  {
    const RT = dst_RT === undefined ? null : dst_RT;

    const current_rt = this.renderer.getRenderTarget();

    this.renderer.setRenderTarget(RT);
    this.renderer.render(this._blit_scene, this._blit_camera);

    this.renderer.setRenderTarget(current_rt);
  }
}

export { Blitter };
