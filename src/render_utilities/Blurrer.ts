import { Graphics } from '../Graphics';
import { BoxBlurMaterial } from '../materials/BoxBlurMaterial';

import { RenderTarget } from 'three';

class Blurrer
{
  RT1: RenderTarget;
  RT2: RenderTarget;
  box_blur_mat: BoxBlurMaterial;
  
  constructor()
  {
    this.RT1 = new RenderTarget(1, 1);
    this.RT2 = new RenderTarget(1, 1);
    this.box_blur_mat = new BoxBlurMaterial();
  }

  blur(RT: RenderTarget)
  {
    if (RT.width !== this.RT1.width || RT.height !== this.RT1.height)
    {
      this.RT1.setSize(RT.width, RT.height);
      this.RT2.setSize(RT.width, RT.height);
    }

    this.box_blur_mat.uniforms._SampleDir.value.set(1, 0);
    Graphics.blit(RT, this.RT1, this.box_blur_mat);
    this.box_blur_mat.uniforms._SampleDir.value.set(0, 1);
    Graphics.blit(this.RT1, RT, this.box_blur_mat);
    // return this.RT2;
  }
}

export { Blurrer };
