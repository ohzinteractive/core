import GaussianBlurMaterial from '../materials/GaussianBlurMaterial';
import LuminosityHighPassMaterial from '../materials/LuminosityHighPassMaterial';
import Graphics from '../Graphics';

import { WebGLRenderTarget, LinearFilter, RGBAFormat } from 'three';

export default class GaussianBlurrer
{
  constructor(nMips = 5)
  {
    this.current_width = 1;
    this.current_height = 1;

    this.separableBlurMaterials = [];
    this.renderTargetsHorizontal = [];
    this.renderTargetsVertical = [];

    this.nMips = nMips;
    this.kernelSizeArray = [3, 5, 7, 9, 11];
    this.rt_pars = { minFilter: LinearFilter, magFilter: LinearFilter, format: RGBAFormat };

    this.renderTargetBright = new WebGLRenderTarget(1, 1, this.rt_pars);
    this.renderTargetBright.texture.generateMipmaps = false;

    this.init_materials();
    this.init_RT();

    this.luminosity_high_pass_mat = new LuminosityHighPassMaterial();
  }

  blur(RT, use_luminosity_high_pass)
  {
    this.resize_RT(RT.width, RT.height);

    if (use_luminosity_high_pass)
    {
      Graphics.blit(RT, this.renderTargetBright, this.luminosity_high_pass_mat);
    }
    else
    {
      Graphics.blit(RT, this.renderTargetBright);
    }

    let inputRenderTarget = this.renderTargetBright;

    for (let i = 0; i < this.nMips; i++)
    {
      let mat = this.separableBlurMaterials[i];

      mat.set_direction(1, 0);
      Graphics.blit(inputRenderTarget, this.renderTargetsHorizontal[i], mat);

      mat.set_direction(0, 1);
      Graphics.blit(this.renderTargetsHorizontal[i], this.renderTargetsVertical[i], mat);

      inputRenderTarget = this.renderTargetsVertical[i];
    }
  }

  get_blurred_texture()
  {
    return this.renderTargetsHorizontal[0].texture;
  }

  get_blurred_RT()
  {
    return this.renderTargetsHorizontal[0];
  }

  init_RT()
  {
    this.dispose_RT();

    this.renderTargetBright.setSize(1, 1);

    for (let i = 0; i < this.nMips; i++)
    {
      let hor = new WebGLRenderTarget(1, 1, this.rt_pars);
      let ver = new WebGLRenderTarget(1, 1, this.rt_pars);

      hor.texture.generateMipmaps = false;
      ver.texture.generateMipmaps = false;

      this.renderTargetsHorizontal.push(hor);
      this.renderTargetsVertical.push(ver);
    }
  }

  resize_RT(texture_width, texture_height)
  {
    if (this.current_width === texture_width && this.current_height === texture_height)
    {
      return;
    }

    this.current_width = texture_width;
    this.current_height = texture_height;

    let width = Math.round(texture_width / 2);
    let height = Math.round(texture_height / 2);

    this.renderTargetBright.setSize(width, height);

    for (let i = 0; i < this.nMips; i++)
    {
      this.renderTargetsVertical[i].setSize(width, height);
      this.renderTargetsHorizontal[i].setSize(width, height);
      this.separableBlurMaterials[i].set_size(width, height);

      width   = Math.round(width / 2);
      height  = Math.round(height / 2);
    }
  }

  init_materials(texture_width, texture_height)
  {
    this.dispose_materials();

    for (let i = 0; i < this.nMips; i++)
    {
      this.separableBlurMaterials.push(new GaussianBlurMaterial(this.kernelSizeArray[i]));
    }
  }

  dispose_materials()
  {
    for (let i = 0; i < this.separableBlurMaterials.length; i++)
    {
      this.separableBlurMaterials[i].dispose();
    }
    this.separableBlurMaterials.length = 0;
  }

  dispose_RT()
  {
    for (let i = 0; i < this.renderTargetsVertical.length; i++)
    {
      this.renderTargetsHorizontal[i].dispose();
      this.renderTargetsVertical[i].dispose();
    }
    this.renderTargetBright.dispose();

    this.renderTargetsHorizontal.length = 0;
    this.renderTargetsVertical.length = 0;
  }
}
