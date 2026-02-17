import { Graphics } from '../Graphics';
import { GaussianBlurMaterial } from '../materials/GaussianBlurMaterial';
import { LuminosityHighPassMaterial } from '../materials/LuminosityHighPassMaterial';

import type { RenderTargetOptions } from 'three';
import { HalfFloatType, LinearFilter, LinearSRGBColorSpace, RenderTarget, RGBAFormat, SRGBColorSpace, UnsignedByteType } from 'three';

class GaussianBlurrer
{
  current_height: number;
  current_width: number;
  kernelSizeArray: number[];
  luminosity_high_pass_mat: LuminosityHighPassMaterial;
  nMips: number;
  renderTargetBright: RenderTarget;
  renderTargetsHorizontal: Array<RenderTarget>;
  renderTargetsVertical: Array<RenderTarget>;
  rt_pars: RenderTargetOptions;
  separableBlurMaterials: Array<GaussianBlurMaterial>;
  use_half_float: boolean;
  
  constructor(use_half_float = false)
  {
    this.current_width = 1;
    this.current_height = 1;

    this.separableBlurMaterials = [];
    this.renderTargetsHorizontal = [];
    this.renderTargetsVertical = [];
    this.use_half_float = use_half_float;
    this.nMips = 5;
    this.kernelSizeArray = [3, 5, 7, 9, 11];

    this.rt_pars = {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      type: use_half_float ? HalfFloatType : UnsignedByteType,
      colorSpace: use_half_float ? LinearSRGBColorSpace : SRGBColorSpace
    };

    this.renderTargetBright = new RenderTarget(1, 1, this.rt_pars);
    this.renderTargetBright.texture.generateMipmaps = false;

    this.init_materials();
    this.init_RT();

    this.luminosity_high_pass_mat = new LuminosityHighPassMaterial();
  }

  blur(RT: RenderTarget, use_luminosity_high_pass: boolean)
  {
    this.resize_RT(RT.width, RT.height);

    let inputRenderTarget = RT;

    if (use_luminosity_high_pass)
    {
      Graphics.blit(RT, this.renderTargetBright, this.luminosity_high_pass_mat);
      inputRenderTarget = this.renderTargetBright;
    }

    for (let i = 0; i < this.nMips; i++)
    {
      const mat = this.separableBlurMaterials[i];

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
      const hor = new RenderTarget(1, 1, this.rt_pars);
      const ver = new RenderTarget(1, 1, this.rt_pars);

      hor.texture.generateMipmaps = false;
      ver.texture.generateMipmaps = false;

      hor.texture.colorSpace = this.rt_pars.colorSpace;
      ver.texture.colorSpace = this.rt_pars.colorSpace;

      this.renderTargetsHorizontal.push(hor);
      this.renderTargetsVertical.push(ver);
    }
  }

  resize_RT(texture_width: number, texture_height: number)
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

  init_materials()
  {
    this.dispose_materials();

    for (let i = 0; i < this.nMips; i++)
    {
      this.separableBlurMaterials.push(new GaussianBlurMaterial(this.kernelSizeArray[i]));
    }
  }

  set_radius(value: number)
  {
    for (let i = 0; i < this.separableBlurMaterials.length; i++)
    {
      this.separableBlurMaterials[i].set_radius(value);
    }
  }

  set_luminosity_threshold(value: number)
  {
    this.luminosity_high_pass_mat.set_threshold(value);
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

export { GaussianBlurrer };
