import { CameraManager } from '../CameraManager';
import { Graphics } from '../Graphics';
import { OScreen } from '../OScreen';
import { SceneManager } from '../SceneManager';
import { DeferredPointLightMaterial } from '../materials/deferred/DeferredPointLightMaterial';
import { BaseRender } from '../render_mode/BaseRender';

import { Matrix4, Mesh, RenderTarget, SphereGeometry } from 'three';
import { AbstractScene } from '../scenes/AbstractScene';

class DeferredRender extends BaseRender
{
  camera_inverse_proj_mat: Matrix4;
  main_rt: RenderTarget;
  scene_lights: AbstractScene;

  constructor()
  {
    super();

    this.main_rt = new RenderTarget(OScreen.width, OScreen.height);

    this.scene_lights = new AbstractScene({ name: 'lights_scene', compilators: {} });

    const light_intensity = 1;
    const light_brightest_component = 1;
    const radius_needed_for_intensity = Math.sqrt(4 * light_intensity * (light_brightest_component * (256.0 / 5.0))) / (2 * light_intensity);
    const sphere = new Mesh(new SphereGeometry(radius_needed_for_intensity), new DeferredPointLightMaterial(light_intensity));

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
    Graphics.generate_depth_normal_texture = true;
  }

  render()
  {
    this.__check_RT_size();

    Graphics.clear(this.main_rt, CameraManager.current, true, false);

    Graphics.render(SceneManager.current, CameraManager.current, this.main_rt);

    this.camera_inverse_proj_mat.copy(CameraManager.current.projectionMatrix).invert();

    const inverse_proj = this.camera_inverse_proj_mat;
    const albedo_rt = this.main_rt;
    const depth_normals_rt = Graphics.depth_normals_RT;

    this.scene_lights.traverse((child: Mesh) =>
    {
      if (child.material)
      {
        (child.material as DeferredPointLightMaterial).set_inverse_proj_matrix(inverse_proj);
        (child.material as DeferredPointLightMaterial).set_normal_depth_rt(depth_normals_rt);
        (child.material as DeferredPointLightMaterial).set_albedo_rt(albedo_rt);
      }
    });

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
