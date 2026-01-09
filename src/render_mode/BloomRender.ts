
import { BloomComposeMaterial } from '../materials/BloomComposeMaterial';
import { BaseRender } from '../render_mode/BaseRender';

import { WebGLRenderTarget } from 'three';

import { CameraManager } from '../CameraManager';
import { Graphics } from '../Graphics';
import { OScreen } from '../OScreen';
import { Blurrer } from '../render_utilities/Blurrer';
import { SceneManager } from '../SceneManager';

class BloomRender extends BaseRender
{
  bloom_compose_mat: any;
  blur_RT: any;
  blurrer: any;
  main_RT: any;
  constructor()
  {
    super();

    this.bloom_compose_mat = new BloomComposeMaterial();
    // @ts-expect-error -- DEBUG --
    window.bloom_mat = this.bloom_compose_mat;

    this.main_RT = undefined;
    this.blur_RT = undefined;
    this.blurrer = undefined;
  }

  on_enter()
  {
    this.blurrer = new Blurrer();
    // this.blurrer = new DualFilteringBlurrer()
    this.main_RT = new WebGLRenderTarget(OScreen.width, OScreen.height);
    this.blur_RT = new WebGLRenderTarget(OScreen.width, OScreen.height);
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
    if (this.main_RT.width !== OScreen.width || this.main_RT.height !== OScreen.height)
    {
      this.main_RT.setSize(OScreen.width, OScreen.height);
      this.blur_RT.setSize(OScreen.width, OScreen.height);
    }
  }
}

export { BloomRender };
