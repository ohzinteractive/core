import DualFilteringBlurMaterial from '../materials/DualFilteringBlurMaterial';
import AlphaFilterMaterial from '../materials/AlphaFilterMaterial';
import Graphics from '../Graphics';
import Screen from '../Screen';
import { WebGLRenderTarget } from 'three';
export default class DualFilteringBlurrer
{
  constructor(use_alpha_mask)
  {
    this.native_width = Screen.render_width;
    this.native_height = Screen.render_height;

    this.RT0 = new WebGLRenderTarget(this.native_width / 2, this.native_height / 2);
    this.RT1 = new WebGLRenderTarget(this.native_width / 2, this.native_height / 2);
    this.RT2 = new WebGLRenderTarget(this.native_width / 4, this.native_height / 4);
    this.RT3 = new WebGLRenderTarget(this.native_width / 8, this.native_height / 8);
    this.RT4 = new WebGLRenderTarget(this.native_width / 16, this.native_height / 16);

    this.upscale_blur_mat   = new DualFilteringBlurMaterial(true);
    this.downscale_blur_mat = new DualFilteringBlurMaterial(false);

    this.alpha_filter_mat = new AlphaFilterMaterial();
  }

  blur(RT)
  {
    this.check_screen_resize();
    Graphics.blit(RT,       this.RT1, this.alpha_filter_mat);

    // Graphics.blit(this.RT0, this.RT1, this.downscale_blur_mat);
    Graphics.blit(this.RT1, this.RT2, this.downscale_blur_mat);
    Graphics.blit(this.RT2, this.RT3, this.downscale_blur_mat);
    Graphics.blit(this.RT3, this.RT4, this.downscale_blur_mat);

    // Graphics.blit(this.RT4, this.RT3, this.upscale_blur_mat);
    // Graphics.blit(this.RT3, this.RT4, this.upscale_blur_mat);
    Graphics.blit(this.RT4, this.RT3, this.upscale_blur_mat);
    Graphics.blit(this.RT3, this.RT2, this.upscale_blur_mat);
    Graphics.blit(this.RT2, RT, this.upscale_blur_mat);
    // Graphics.blit(this.RT1, RT,       this.upscale_blur_mat);

    // return this.RT2;
  }

  check_screen_resize()
  {
    if (Screen.render_width !== this.native_width || Screen.render_height !== this.native_height)
    {
      this.native_width = Screen.render_width;
      this.native_height = Screen.render_height;
      this.RT0.setSize(this.native_width / 2, this.native_height / 2);
      this.RT1.setSize(this.native_width / 2, this.native_height / 2);
      this.RT2.setSize(this.native_width / 4, this.native_height / 4);
      this.RT3.setSize(this.native_width / 8, this.native_height / 8);
      this.RT4.setSize(this.native_width / 16, this.native_height / 16);
    }
  }
}
