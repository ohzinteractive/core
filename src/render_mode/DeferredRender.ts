import { CameraManager } from '../CameraManager';
import { Graphics } from '../Graphics';
import { OScreen } from '../OScreen';
import { SceneManager } from '../SceneManager';
import { DeferredRendererComposeMaterial } from '../materials/DeferredRendererComposeMaterial';
import { DeferredPointLightMaterial } from '../materials/deferred/DeferredPointLightMaterial';
import { BaseRender } from '../render_mode/BaseRender';

import { Matrix4, Mesh, Scene, SphereGeometry, WebGLRenderTarget } from 'three';

class DeferredRender extends BaseRender
{
  camera_inverse_proj_mat: any;
  compose_mat: any;
  main_rt: any;
  scene_lights: any;
  constructor()
  {
    super();

    this.compose_mat = new DeferredRendererComposeMaterial();
    this.main_rt = new WebGLRenderTarget(OScreen.width, OScreen.height, {
      // magFilter: NearestFilter,
      // minFilter: NearestFilter
    });

    this.scene_lights = new Scene();

    const light_intensity = 1;
    const light_brightest_component = 1;
    const radius_needed_for_intensity = Math.sqrt(4 * light_intensity * (light_brightest_component * (256.0 / 5.0))) / (2 * light_intensity);
    const sphere = new Mesh(new SphereGeometry(radius_needed_for_intensity), new DeferredPointLightMaterial(light_intensity));
    // sphere.position.y = 2;
    // this.scene_lights.add(sphere);

    // let sphere2 = sphere.clone();
    // sphere2.position.x = 2;
    // this.scene_lights.add(sphere2);

    // let sphere3 = sphere.clone();
    // sphere3.position.x = -2;
    // this.scene_lights.add(sphere3);

    // let sphere4 = sphere.clone();
    // sphere4.position.z = -2;
    // this.scene_lights.add(sphere4);

    // let sphere5 = sphere.clone();
    // sphere5.position.z = 2;
    // this.scene_lights.add(sphere5);

    const light_row = 2;
    const light_col = 2;
    for (let x = 0; x < light_row; x++)
    {
      for (let y = 0; y < light_col; y++)
      {
        const clone = sphere.clone();
        clone.position.set(x * 2 - light_row / 2, 1, y * 2 - light_col / 2);
        this.scene_lights.add(clone);
      }
    }

    this.camera_inverse_proj_mat = new Matrix4();
  }

  on_enter()
  {
    Graphics.generateDepthNormalTexture = true;
  }

  render()
  {
    this.__check_RT_size();

    Graphics.clear(this.main_rt, CameraManager.current, true, false);

    Graphics.render(SceneManager.current, CameraManager.current, this.main_rt);

    // this.compose_mat.set_normal_depth_rt(Graphics.depth_normals_RT);
    // this.compose_mat.set_proj_matrix(CameraManager.current.projectionMatrix);

    // Graphics.blit(this.main_rt, undefined, this.compose_mat);

    this.camera_inverse_proj_mat.getInverse(CameraManager.current.projectionMatrix);

    const inverse_proj = this.camera_inverse_proj_mat;
    const albedo_rt = this.main_rt;
    const depth_normals_rt = Graphics.depth_normals_RT;
    this.scene_lights.traverse((child: any) => {
      if (child.material)
      {
        child.material.set_inverse_proj_matrix(inverse_proj);
        child.material.set_normal_depth_rt(depth_normals_rt);
        child.material.set_albedo_rt(albedo_rt);
      }
    });
    // Graphics.clear(undefined, CameraManager.current, true, true);
    // Graphics.render(SceneManager.current, CameraManager.current);
    Graphics.clear(undefined, CameraManager.current, true, true);
    Graphics.render(this.scene_lights, CameraManager.current);
  }

  __check_RT_size()
  {
    if (this.main_rt.width !== OScreen.width || this.main_rt.height !== OScreen.height)
    {
      this.main_rt.setSize(OScreen.width, OScreen.height);
    }
  }
}

export { DeferredRender };
