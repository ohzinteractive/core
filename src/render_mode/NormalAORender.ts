import { CameraManager } from '../CameraManager';
import { Graphics } from '../Graphics';
import { DisplayNormalTextureMaterial } from '../materials/DisplayNormalTextureMaterial';
import { SSAOComposeMaterial } from '../materials/SSAOComposeMaterial';
import { SSAOMaterial } from '../materials/SSAOMaterial';
import { OScreen } from '../OScreen';
import { BaseRender } from '../render_mode/BaseRender';
import { Blurrer } from '../render_utilities/Blurrer';
import { SceneManager } from '../SceneManager';

import { RenderTarget } from 'three';

class NormalAORender extends BaseRender
{
  SSAO_RT: RenderTarget;
  blurrer: Blurrer;
  debug_normals: DisplayNormalTextureMaterial;
  main_RT: RenderTarget;
  ssaa: number;
  ssao_compose_mat: SSAOComposeMaterial;
  ssao_mat: SSAOMaterial;

  constructor(use_ssaa = false)
  {
    super();

    this.ssao_mat = new SSAOMaterial();
    this.ssao_compose_mat = new SSAOComposeMaterial();
    this.debug_normals = new DisplayNormalTextureMaterial();

    this.ssaa = use_ssaa ? 2 : 1;

    this.main_RT = new RenderTarget(OScreen.width * this.ssaa, OScreen.height * this.ssaa);
    this.SSAO_RT = new RenderTarget(OScreen.width, OScreen.height);

    this.blurrer = new Blurrer();
    Graphics.generate_depth_normal_texture = true;
  }

  render()
  {
    this.__check_RT_size();

    Graphics.clear(this.main_RT, CameraManager.current, true, false);
    Graphics.render(SceneManager.current, CameraManager.current, this.main_RT);

    this.__update_uniforms();

    Graphics.blit(Graphics.depth_normals_RT, this.SSAO_RT, this.ssao_mat);

    // // BLUR
    this.blurrer.blur(this.SSAO_RT);
    Graphics.blit(this.SSAO_RT, undefined);

    // // COMPOSE
    this.ssao_compose_mat.uniforms._AO.value = this.SSAO_RT.texture;
    Graphics.blit(this.main_RT, undefined, this.ssao_compose_mat);

    // Graphics.blit(this.SSAO_RT, undefined);
  }

  __update_uniforms()
  {
    this.ssao_mat.uniforms._InverseProjMatrix.value = CameraManager.current.projectionMatrix.clone().invert();
    this.ssao_mat.uniforms._ProjectionMatrix.value = CameraManager.current.projectionMatrix.clone();
    this.ssao_mat.uniforms._FarPlane.value = CameraManager.current.far;
  }

  __check_RT_size()
  {
    if (this.main_RT.width !== OScreen.width * this.ssaa || this.main_RT.height !== OScreen.height * this.ssaa)
    {
      this.main_RT.setSize(OScreen.width * this.ssaa, OScreen.height * this.ssaa);
      this.SSAO_RT.setSize(OScreen.width, OScreen.height);
    }
  }
}

export { NormalAORender };
