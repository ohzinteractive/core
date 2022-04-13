import OScreen from '../OScreen';
import RenderLayers from '../RenderLayers';
import compose_frag from '../shaders/box_blur/compose.frag';
import box_blur_frag from '../shaders/box_blur/box_blur.frag';
import copy_frag from '../shaders/copy/copy.frag';
import copy_vert from '../shaders/copy/copy.vert';
import background_frag from '../shaders/basic_color/basic_color.frag';

import { WebGLRenderTarget } from 'three';
import { Mesh } from 'three';
import { PlaneGeometry } from 'three';
import { Scene } from 'three';
import { ShaderMaterial } from 'three';
import { Vector2 } from 'three';
import { Vector4 } from 'three';

export default class OutlineRender
{
  constructor(webgl)
  {
    this.main_rt = new WebGLRenderTarget(OScreen.width, OScreen.height);
    this.rt1     = new WebGLRenderTarget(OScreen.width, OScreen.height);
    this.rt2     = new WebGLRenderTarget(OScreen.width, OScreen.height);

    this.compose_material    = this.__get_compose_material();
    this.copy_material       = this.__get_copy_material();
    this.box_blur_material   = this.__get_box_blur_material();
    this.background_material = this.__get_background_material();

    this.copy_plane = new Mesh(new PlaneGeometry(1, 1), this.copy_material);
    this.copy_plane.frustumCulled = false;
    this.copy_scene = new Scene();
    this.copy_scene.add(this.copy_plane);
  }

  resize(w, h)
  {
    this.main_rt.setSize(w, h);
    this.rt1.setSize(w, h);
    this.rt2.setSize(w, h);
    this.box_blur_material.uniforms._Screen.value.set(w, h);
    this.compose_material.uniforms._Screen.value.set(w, h);
  }

  render(webgl)
  {
    webgl.camera.updateMatrix();
    webgl.camera.updateMatrixWorld();

    webgl.camera.layers.enable(RenderLayers.opaque);
    webgl.camera.layers.enable(RenderLayers.transparent);
    webgl.camera.layers.disable(RenderLayers.outline);

    // render scene
    webgl._renderer.setClearColor(webgl.clear_color, 0);
    webgl._renderer.clearTarget(this.main_rt, true, true, true);

    this.copy_scene.overrideMaterial = this.background_material;
    this.background_material.uniforms._Color.value.set(webgl.clear_color.r, webgl.clear_color.g, webgl.clear_color.b, 0);
    webgl._renderer.render(this.copy_scene, webgl.camera, this.main_rt, false);

    webgl._renderer.render(webgl.scene, webgl.camera, this.main_rt, false);

    // horizontal blur
    this.box_blur_material.uniforms._MainTex.value = this.main_rt.texture;
    this.box_blur_material.uniforms._SampleDir.value.set(1, 0);

    this.copy_scene.overrideMaterial = this.box_blur_material;
    webgl._renderer.render(this.copy_scene, webgl.camera, this.rt1, false);

    // vertical blur
    this.box_blur_material.uniforms._SampleDir.value.set(0, 1);
    this.box_blur_material.uniforms._MainTex.value = this.rt1.texture;

    webgl._renderer.render(this.copy_scene, webgl.camera, this.rt2, false);

    // compose
    this.copy_scene.overrideMaterial = this.compose_material;
    this.compose_material.uniforms._MainTex.value = this.main_rt.texture;
    this.compose_material.uniforms._Blur.value = this.rt2.texture;
    webgl._renderer.render(this.copy_scene, webgl.camera, undefined, false);
    this.copy_scene.overrideMaterial = undefined;
  }

  __get_copy_material()
  {
    return new ShaderMaterial({
      uniforms: {
        _MainTex: { value: undefined }
      },
      vertexShader: copy_vert,
      fragmentShader: copy_frag,
      depthTest: false,
      depthWrite: false
    });
  }

  __get_box_blur_material()
  {
    return new ShaderMaterial({
      uniforms: {
        _MainTex: { value: undefined },
        _SampleDir: { value: new Vector2() },
        _Screen: { value: new Vector2(OScreen.width, OScreen.height) }
      },
      vertexShader: copy_vert,
      fragmentShader: box_blur_frag,
      depthTest: false,
      depthWrite: false
    });
  }

  __get_compose_material()
  {
    return new ShaderMaterial({
      uniforms: {
        _MainTex: { value: undefined },
        _Blur: { value: undefined },
        _Screen: { value: new Vector2(OScreen.width, OScreen.height) }
      },
      vertexShader: copy_vert,
      fragmentShader: compose_frag,
      depthTest: false,
      depthWrite: false,
      extensions: {
        derivatives: true
      }
    });
  }

  __get_background_material()
  {
    return new ShaderMaterial({
      uniforms: {
        _Color: { value: new Vector4(0, 0, 0, 0) }
      },
      vertexShader: copy_vert,
      fragmentShader: background_frag,
      depthTest: true,
      depthWrite: false

    });
  }

  on_enter(webgl)
  {
    webgl._renderer.autoClear = false;
  }

  on_exit(webgl)
  {
    webgl._renderer.autoClear = true;
  }
}
