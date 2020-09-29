import CameraManager from '../CameraManager';
import SceneManager from '../SceneManager';
import Screen from '../Screen';
import BaseRender from '../render_mode/BaseRender';
import Configuration from '../Configuration';
import SSAOMaterial from '../materials/SSAOMaterial';
import SSAOComposeMaterial from '../materials/SSAOComposeMaterial';
import DisplayNormalTextureMaterial from '../materials/DisplayNormalTextureMaterial';
import Blurrer from '../render_utilities/Blurrer';
import Graphics from '../Graphics';

import { WebGLRenderTarget } from 'three';

export default class NormalAORender extends BaseRender
{
  constructor()
  {
    super();

    this.ssao_mat = new SSAOMaterial();
    this.ssao_compose_mat = new SSAOComposeMaterial();
    this.debug_normals = new DisplayNormalTextureMaterial();

    this.ssaa = Configuration.use_ssaa ? 2 : 1;

    this.main_RT = new WebGLRenderTarget(Screen.width * this.ssaa, Screen.height * this.ssaa);

    this.SSAO_RT = new WebGLRenderTarget(Screen.width, Screen.height);

    this.blurrer = new Blurrer();
    Graphics.generateDepthNormalTexture = true;
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
    this.ssao_mat.uniforms._InverseProjMatrix.value.getInverse(CameraManager.current.projectionMatrix);
    this.ssao_mat.uniforms._ProjectionMatrix.value.copy(CameraManager.current.projectionMatrix);
    this.ssao_mat.uniforms._FarPlane.value = CameraManager.current.far;
  }

  __check_RT_size()
  {
    if (this.main_RT.width !== Screen.width * this.ssaa || this.main_RT.height !== Screen.height * this.ssaa)
    {
      this.main_RT.setSize(Screen.width * this.ssaa, Screen.height * this.ssaa);
      this.SSAO_RT.setSize(Screen.width, Screen.height);
    }
  }
}
