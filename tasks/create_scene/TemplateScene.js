
import { AbstractScene } from './common/AbstractScene';

import { Sections } from '../views/Sections';

import { template_high_objects } from '../../data/assets/template/high/template_high_objects';
import { template_high_sounds } from '../../data/assets/template/high/template_high_sounds';
import { template_high_textures } from '../../data/assets/template/high/template_high_textures';
import { template_objects } from '../../data/assets/template/template_objects';
import { template_sounds } from '../../data/assets/template/template_sounds';
import { template_textures } from '../../data/assets/template/template_textures';

import { CameraManager, Debug, Grid, OScreen, PerspectiveCamera } from 'ohzi-core';
import { Color } from 'three';
import { Settings } from '../Settings';
import { CameraController } from '../camera_controller/CameraController';

class TemplateScene extends AbstractScene
{
  constructor()
  {
    super({
      name: Sections.TEMPLATE
    });
  }

  init()
  {
    this.camera_controller = new CameraController();

    this.init_camera();

    this.set_assets(template_objects, template_textures, template_sounds);

    if (Settings.debug_mode)
    {
      this.add(Debug.draw_axis());
      this.add(new Grid());
    }
  }

  update()
  {
    super.update();

    this.camera_controller.update();
  }

  on_assets_ready()
  {
    this.set_high_assets(template_high_objects, template_high_textures, template_high_sounds);

    super.on_assets_ready();
  }

  on_high_quality_assets_ready()
  {
    super.on_high_quality_assets_ready();
  }

  init_camera()
  {
    this.camera = new PerspectiveCamera(60, OScreen.aspect_ratio, 0.1, 200);
    this.camera.updateProjectionMatrix();
    this.camera.position.z = 10;

    this.camera.clear_color.copy(new Color('#181818'));
    this.camera.clear_alpha = 1;
  }

  setup_camera()
  {
    CameraManager.current = this.camera;

    this.camera_controller.set_camera(this.camera);
    // this.camera_controller.set_idle();
    this.camera_controller.set_simple_mode();

    this.camera_controller.min_zoom = 1;
    this.camera_controller.max_zoom = 40;
    this.camera_controller.reference_zoom = 10;

    this.camera_controller.reference_position.set(0, 0, 0);
    this.camera_controller.set_rotation(0, 0);
  }
}

export { TemplateScene };
