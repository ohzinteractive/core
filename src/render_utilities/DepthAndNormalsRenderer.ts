import { CameraManager } from '../CameraManager';
import { OScreen } from '../OScreen';

import { ClearDepthNormalMaterial } from '../materials/ClearDepthNormalMaterial';
import { DepthNormalMaterial } from '../materials/DepthNormalMaterial';

import { Vector3, WebGLRenderTarget } from 'three';

class DepthAndNormalsRenderer
{
  RT: any;
  clear_depth_normal_mat: any;
  depth_normal_material: any;
  constructor()
  {
    this.RT = new WebGLRenderTarget(OScreen.width, OScreen.height);

    this.clear_depth_normal_mat = new ClearDepthNormalMaterial(1, new Vector3(0, 0, 1));
    this.depth_normal_material = new DepthNormalMaterial();
  }

  render(graphics: any)
  {
    this.__resize_RT_if_necessary();

    graphics.clear(this.RT, undefined, true, true);

    graphics.blit_clear_with_material(this.RT, this.clear_depth_normal_mat);

    this.depth_normal_material.far_plane = CameraManager.current.far;

    graphics.render(undefined, undefined, this.RT, this.depth_normal_material);
  }

  __resize_RT_if_necessary()
  {
    if (this.RT.width !== OScreen.width || this.RT.height !== OScreen.height)
    {
      this.RT.setSize(OScreen.width, OScreen.height);
    }
  }

  get render_target()
  {
    return this.RT;
  }
}

export { DepthAndNormalsRenderer };
