import { WebGLRenderTarget } from 'three';
import { Graphics } from '../Graphics';
import { AlphaFilterMaterial } from '../materials/AlphaFilterMaterial';
import { DualFilteringBlurMaterial } from '../materials/DualFilteringBlurMaterial';
class DualFilteringBlurrer
{
  RT0: any;
  RT1: any;
  RT2: any;
  RT3: any;
  RT4: any;
  alpha_filter_mat: any;
  current_height: any;
  current_width: any;
  downscale_blur_mat: any;
  upscale_blur_mat: any;
  
  constructor(use_alpha_mask: any)
  {
    this.current_width  = 1;
    this.current_height = 1;
    this.RT0 = new WebGLRenderTarget(1, 1);
    this.RT1 = new WebGLRenderTarget(1, 1);
    this.RT2 = new WebGLRenderTarget(1, 1);
    this.RT3 = new WebGLRenderTarget(1, 1);
    this.RT4 = new WebGLRenderTarget(1, 1);

    this.upscale_blur_mat   = new DualFilteringBlurMaterial(true);
    this.downscale_blur_mat = new DualFilteringBlurMaterial(false);

    this.alpha_filter_mat = new AlphaFilterMaterial();
  }

  blur(RT: any)
  {
    this.check_RT_resize(RT.width, RT.height);
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

  check_RT_resize(width: any, height: any)
  {
    if (this.current_width !== width || this.current_height !== height)
    {
      this.current_width = width;
      this.current_height = height;
      this.RT0.setSize(this.current_width / 2, this.current_height / 2);
      this.RT1.setSize(this.current_width / 2, this.current_height / 2);
      this.RT2.setSize(this.current_width / 4, this.current_height / 4);
      this.RT3.setSize(this.current_width / 8, this.current_height / 8);
      this.RT4.setSize(this.current_width / 16, this.current_height / 16);
    }
  }
}

export { DualFilteringBlurrer };
