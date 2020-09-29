import CameraManager from '../CameraManager';
import Screen from '../Screen';

import ClearDepthNormalMaterial from '../materials/ClearDepthNormalMaterial';
import DepthNormalMaterial from '../materials/DepthNormalMaterial';
import * as THREE from 'three';

export default class DepthAndNormalsRenderer
{
  constructor()
  {
    this.RT = new THREE.WebGLRenderTarget(Screen.width, Screen.height);

    this.clear_depth_normal_mat = new ClearDepthNormalMaterial(1, new THREE.Vector3(0, 0, 1));
    this.depth_normal_material = new DepthNormalMaterial();
  }

  render(graphics)
  {
    this.__resize_RT_if_necessary();

    graphics.clear(this.RT, undefined, true, true);

    graphics.blit_clear_with_material(this.RT, this.clear_depth_normal_mat);

    this.depth_normal_material.far_plane = CameraManager.current.far;

    graphics.render(undefined, undefined, this.RT, this.depth_normal_material);
  }

  __resize_RT_if_necessary()
  {
    if (this.RT.width !== Screen.width || this.RT.height !== Screen.height)
    {
      this.RT.setSize(Screen.width, Screen.height);
    }
  }

  get render_target()
  {
    return this.RT;
  }
}
