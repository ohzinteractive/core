import Screen from '../Screen';
import BaseRender from '../render_mode/BaseRender';
import BloomComposeMaterial from '../materials/BloomComposeMaterial';

import { WebGLRenderTarget } from 'three';

import Blurrer from '../render_utilities/Blurrer';
import Graphics from '../Graphics';
import CameraManager from '../CameraManager';
import SceneManager from '../SceneManager';

export default class BloomRender extends BaseRender
{
  constructor()
  {
    super();

    this.bloom_compose_mat = new BloomComposeMaterial();
    window.bloom_mat = this.bloom_compose_mat;

    this.main_RT = undefined;
    this.blur_RT = undefined;
    this.blurrer = undefined;
  }

  on_enter()
  {
    this.blurrer = new Blurrer();
    // this.blurrer = new DualFilteringBlurrer()
    this.main_RT = new WebGLRenderTarget(Screen.render_width, Screen.render_height);
    this.blur_RT = new WebGLRenderTarget(Screen.render_width, Screen.render_height);
  }

  render()
  {
    this.__check_RT_size();

    Graphics.clear(this.main_RT, CameraManager.current, true, false);
    Graphics.render(SceneManager.current, CameraManager.current, this.main_RT);

    Graphics.blit(this.main_RT, this.blur_RT);

    // // BLUR
    this.blurrer.blur(this.blur_RT);

    this.bloom_compose_mat.uniforms._BlurredTex.value = this.blur_RT.texture;

    // // // COMPOSE
    Graphics.blit(this.main_RT, undefined, this.bloom_compose_mat);
  }

  __check_RT_size()
  {
    if (this.main_RT.width !== Screen.render_width || this.main_RT.height !== Screen.render_height)
    {
      this.main_RT.setSize(Screen.render_width, Screen.render_height);
      this.blur_RT.setSize(Screen.render_width, Screen.render_height);
    }
  }
}
