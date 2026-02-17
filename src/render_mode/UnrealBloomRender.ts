import { AddMaterial } from '../materials/AddMaterial';
import { UnrealBloomComposeMaterial } from '../materials/UnrealBloomComposeMaterial';
import { OScreen } from '../OScreen';
import { BaseRender } from '../render_mode/BaseRender';

import { HalfFloatType, LinearSRGBColorSpace, NearestFilter, RenderTarget, RGBAFormat, UnsignedByteType } from 'three';

import { CameraManager } from '../CameraManager';
import { Graphics } from '../Graphics';
import { GaussianBlurrer } from '../render_utilities/GaussianBlurrer';
import { SceneManager } from '../SceneManager';

class UnrealBloomRender extends BaseRender
{
  add_mat: AddMaterial;
  bloom_compose_mat: UnrealBloomComposeMaterial;
  blurrer: GaussianBlurrer;
  luminosity_threshold: any;
  main_RT: RenderTarget;
  use_hight_luminosity_pass: boolean;
  use_rendering_size: boolean;
  
  constructor(use_antialiasing: boolean, use_half_float: boolean, use_hight_luminosity_pass: boolean, use_rendering_size = false)
  {
    super();

    this.add_mat = new AddMaterial(use_half_float);

    const rt_settings = {
      samples: use_antialiasing ? 8 : 1,
      type: use_half_float ? HalfFloatType : UnsignedByteType,
      format: RGBAFormat,
      colorSpace: LinearSRGBColorSpace,
      minFilter: NearestFilter,
      magFilter: NearestFilter
    };
    this.use_rendering_size = use_rendering_size;
    this.main_RT = new RenderTarget(1, 1, rt_settings);
    this.main_RT.texture.colorSpace = LinearSRGBColorSpace;
    this.main_RT.texture.minFilter = NearestFilter;
    this.main_RT.texture.magFilter = NearestFilter;

    this.bloom_compose_mat = new UnrealBloomComposeMaterial(5, use_half_float);
    this.blurrer = new GaussianBlurrer(use_half_float);
    this.use_hight_luminosity_pass = use_hight_luminosity_pass;
    this.luminosity_threshold = 0.5;
  }

  on_enter()
  {
    this.bloom_compose_mat.set_RT_0(this.blurrer.renderTargetsVertical[0].texture);
    this.bloom_compose_mat.set_RT_1(this.blurrer.renderTargetsVertical[1].texture);
    this.bloom_compose_mat.set_RT_2(this.blurrer.renderTargetsVertical[2].texture);
    this.bloom_compose_mat.set_RT_3(this.blurrer.renderTargetsVertical[3].texture);
    this.bloom_compose_mat.set_RT_4(this.blurrer.renderTargetsVertical[4].texture);
    
    this.add_mat.set_add_texture(this.blurrer.renderTargetsHorizontal[0].texture);
  }

  render()
  {
    this.__check_RT_size();

    Graphics.clear(this.main_RT, CameraManager.current, true, false);
    Graphics.render(SceneManager.current, CameraManager.current, this.main_RT);

    // // // BLUR
    this.blurrer.blur(this.main_RT, this.use_hight_luminosity_pass);

    // // Blur compose
    Graphics.material_pass(this.bloom_compose_mat, this.blurrer.renderTargetsHorizontal[0]);

    // // Additive blend
    // Graphics.clear(undefined, CameraManager.current, true, false);
    // Graphics.render(SceneManager.current, CameraManager.current);
    Graphics.blit(this.main_RT, undefined, this.add_mat);
  }

  set_bloom_strength(val: number)
  {
    this.bloom_compose_mat.set_bloom_strength(val);
  }

  set_bloom_radius(val: number)
  {
    // this.bloom_compose_mat.set_bloom_radius(val);
    this.blurrer.set_radius(val);
  }

  set_luminosity_threshold(value: number)
  {
    this.blurrer.set_luminosity_threshold(value);
  }

  set_tint_color_0(col_string: string)
  {
    this.bloom_compose_mat.set_tint_color_0(col_string);
  }

  set_tint_color_1(col_string: string)
  {
    this.bloom_compose_mat.set_tint_color_1(col_string);
  }

  set_tint_color_2(col_string: string)
  {
    this.bloom_compose_mat.set_tint_color_2(col_string);
  }

  set_tint_color_3(col_string: string)
  {
    this.bloom_compose_mat.set_tint_color_3(col_string);
  }

  set_tint_color_4(col_string: string)
  {
    this.bloom_compose_mat.set_tint_color_4(col_string);
  }

  __check_RT_size()
  {
    const width = this.use_rendering_size ? OScreen.render_width : OScreen.width;
    const height = this.use_rendering_size ? OScreen.render_height : OScreen.height;
    if (this.main_RT.width !== width || this.main_RT.height !== height)
    {
      this.main_RT.setSize(width, height);
    }
  }
}

export { UnrealBloomRender };
