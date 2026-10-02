import { RenderTarget } from 'three';
import { Graphics } from '../Graphics';
import { DualFilteringBlurMaterial } from '../materials/DualFilteringBlurMaterial';
class DualFilteringBlurrer
{
  RT0: RenderTarget;
  RT1: RenderTarget;
  RT2: RenderTarget;
  RT3: RenderTarget;
  RT4: RenderTarget;
  current_height: number;
  current_width: number;
  downscale_blur_mat: DualFilteringBlurMaterial;
  upscale_blur_mat: DualFilteringBlurMaterial;
  
  constructor()
  {
    this.current_width  = 1;
    this.current_height = 1;
    this.RT0 = new RenderTarget(1, 1);
    this.RT1 = new RenderTarget(1, 1);
    this.RT2 = new RenderTarget(1, 1);
    this.RT3 = new RenderTarget(1, 1);
    this.RT4 = new RenderTarget(1, 1);

    this.upscale_blur_mat   = new DualFilteringBlurMaterial(true);
    this.downscale_blur_mat = new DualFilteringBlurMaterial(false);
  }

  blur(RT: RenderTarget)
  {
    this.check_RT_resize(RT.width, RT.height);
    Graphics.blit(RT,       this.RT1);

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

  check_RT_resize(width: number, height: number)
  {
    if (this.current_width !== width || this.current_height !== height)
    {
      this.current_width = width;
      this.current_height = height;

      // this.resize(this.RT0, 2);
      this.resize(this.RT1, 2);
      this.resize(this.RT2, 4);
      this.resize(this.RT3, 8);
      this.resize(this.RT4, 16);
    }
  }

  // Whole pixels, and at least one: GPU textures have no fractional or zero sizes.
  resize(target: RenderTarget, divisor: number)
  {
    target.setSize(
      Math.max(1, Math.floor(this.current_width / divisor)),
      Math.max(1, Math.floor(this.current_height / divisor))
    );
  }
}

export { DualFilteringBlurrer };
