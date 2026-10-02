import { BloomComposeMaterial } from '../materials/BloomComposeMaterial';
import { BaseRender } from '../render_mode/BaseRender';

import { RenderTarget } from 'three';

import { CameraManager } from '../CameraManager';
import { Graphics } from '../Graphics';
import { OScreen } from '../OScreen';
import { Blurrer } from '../render_utilities/Blurrer';
import { DualFilteringBlurrer } from '../render_utilities/DualFilteringBlurrer';
import { SceneManager } from '../SceneManager';

class BloomRender extends BaseRender
{
  bloom_compose_mat: BloomComposeMaterial;
  blur_RT: RenderTarget;
  blurrer: Blurrer | DualFilteringBlurrer;
  main_RT: RenderTarget;
  use_dual_filtering: boolean;

  // use_dual_filtering swaps the box blur for the dual filtering (Kawase) blur, which
  // spreads the glow much wider.
  constructor(use_dual_filtering = false)
  {
    super();

    this.use_dual_filtering = use_dual_filtering;

    this.bloom_compose_mat = new BloomComposeMaterial();
    // @ts-expect-error -- DEBUG --
    window.bloom_mat = this.bloom_compose_mat;

    this.main_RT = undefined;
    this.blur_RT = undefined;
    this.blurrer = undefined;
  }

  on_enter()
  {
    this.blurrer = this.use_dual_filtering ? new DualFilteringBlurrer() : new Blurrer();
    this.main_RT = new RenderTarget(OScreen.width, OScreen.height);
    this.blur_RT = new RenderTarget(OScreen.width, OScreen.height);
  }

  // Frees what on_enter built. Render modes are often built once per switch and then
  // dropped, so anything kept past on_exit stays on the GPU.
  on_exit()
  {
    this.blurrer.dispose();
    this.main_RT.dispose();
    this.blur_RT.dispose();
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
