import { CameraManager } from '../CameraManager';
import { OScreen } from '../OScreen';
import { SceneManager } from '../SceneManager';
import { ViewPositionMaterial } from '../materials/ViewPositionMaterial';

import { Color, FloatType, WebGLRenderTarget } from 'three';

class ViewPositionRenderer
{
  RT: any;
  clear_color: any;
  render_pos_mat: any;
  constructor()
  {
    this.RT = new WebGLRenderTarget(OScreen.width, OScreen.height, { type: FloatType });
    this.clear_color = new Color(0, 0, 0);
    this.render_pos_mat = new ViewPositionMaterial();
  }

  render(context: any, renderer: any)
  {
    if (this.RT.width !== OScreen.width || this.RT.height !== OScreen.height)
    {
      this.RT.setSize(OScreen.width, OScreen.height);
    }

    if (CameraManager.current)
    {
      CameraManager.current.aspect = OScreen.aspect_ratio;
      CameraManager.current.updateProjectionMatrix();
      CameraManager.current.updateMatrix();
      CameraManager.current.updateMatrixWorld(true);

      renderer.setRenderTarget(this.RT);
      this.clear_color.set(CameraManager.current.far, CameraManager.current.far, CameraManager.current.far);
      renderer.setClearColor(this.clear_color, 1);
      renderer.clear(true, true, false);

      SceneManager.current.overrideMaterial = this.render_pos_mat;
      renderer.render(SceneManager.current, CameraManager.current, this.RT, false);
      SceneManager.current.overrideMaterial = undefined;
    }
  }

  get render_target()
  {
    return this.RT;
  }
}

export { ViewPositionRenderer };
