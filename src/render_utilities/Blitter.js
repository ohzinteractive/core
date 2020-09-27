import BlitMaterial from '/materials/BlitMaterial';
import * as THREE from 'three';

export default class Blitter
{
  constructor(renderer)
  {
    this.renderer = renderer;
    this._blit_scene = new THREE.Scene();
    this._blit_material = new BlitMaterial();
    this._blit_quad = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1, 1), this._blit_material);
    this._blit_scene.add(this._blit_quad);
    this._blit_camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10000, 10000);
  }

  blit(src, dst)
  {
    this._blit_quad.material = this._blit_material;
    this._blit_quad.material.uniforms._MainTex.value = src.texture;
    this._blit_quad.material.uniforms._Resolution.value.set(src.width, src.height);

    if (dst)
    {
      this._blit_quad.material.uniforms._TargetResolution.value.set(dst.width, dst.height);
    }
    else
    {
      this.renderer.getSize(this._blit_quad.material.uniforms._TargetResolution.value)
      ;
    }

    this.renderer.setRenderTarget(dst === undefined ? null : dst);

    this.renderer.render(this._blit_scene,
      this._blit_camera);
  }

  blit_with_material(src, dst, mat)
  {
    this._blit_quad.material = mat;
    this._blit_quad.material.uniforms._MainTex.value = src.texture;
    this._blit_quad.material.uniforms._Resolution.value.set(src.width, src.height);
    if (dst)
    {
      this._blit_quad.material.uniforms._TargetResolution.value.set(dst.width, dst.height);
    }
    else
    {
      this.renderer.getSize(this._blit_quad.material.uniforms._TargetResolution.value)
      ;
    }

    this.renderer.setRenderTarget(dst === undefined ? null : dst);

    this.renderer.render(this._blit_scene,
      this._blit_camera);
  }

  blit_clear_with_material(dst_RT, mat)
  {
    this._blit_quad.material = mat;

    this.renderer.setRenderTarget(dst_RT === undefined ? null : dst_RT);

    this.renderer.render(this._blit_scene, this._blit_camera);
  }
}
