import BoxBlurMaterial from '/materials/BoxBlurMaterial';
import Graphics from '/Graphics';

export default class Blurrer
{

  constructor(renderer)
  {
    this.RT1 = new THREE.WebGLRenderTarget(1,1);
    this.RT2 = new THREE.WebGLRenderTarget(1,1);
    this.box_blur_mat = new BoxBlurMaterial();
  }


  blur(RT)
  {
    if(RT.width !== this.RT1.width || RT.height !== this.RT1.height)
    {
      this.RT1.setSize(RT.width, RT.height);
      this.RT2.setSize(RT.width, RT.height);
    }

    this.box_blur_mat.uniforms._SampleDir.value.set(1,0);
    Graphics.blit(RT, this.RT1, this.box_blur_mat);
    this.box_blur_mat.uniforms._SampleDir.value.set(0,1);
    Graphics.blit(this.RT1, RT, this.box_blur_mat);
    // return this.RT2;

  }




}
