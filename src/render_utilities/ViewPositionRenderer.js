import { CameraManager } from '../CameraManager';
import { SceneManager } from '../SceneManager';
import { OScreen } from '../OScreen';
import { ViewPositionMaterial } from '../materials/ViewPositionMaterial';

import { WebGLRenderTarget } from 'three';
import { FloatType } from 'three';
import { Color } from 'three';

class ViewPositionRenderer
{
  constructor()
  {
    this.RT = new WebGLRenderTarget(OScreen.width, OScreen.height, { type: FloatType });
    this.clear_color = new Color(0, 0, 0);
    this.render_pos_mat = new ViewPositionMaterial();
  }

  render(context, renderer)
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
