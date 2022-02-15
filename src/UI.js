import Input from './Input';
import CameraManager from './CameraManager';
import Graphics from './Graphics';

import { Vector2 } from 'three';
import { Scene } from 'three';
import { OrthographicCamera } from 'three';

class UI
{
  init()
  {
    this.ui_elements = [];
    this._tmp_normalized_pos = new Vector2();
    this.ss_scene = new Scene();
    this.ss_scene.autoUpdate = false;
    this.ss_scene.frustumCulled = false;

    this.ws_scene = new Scene();
    this.ws_scene.autoUpdate = false;
    this.ws_scene.frustumCulled = false;

    this.ss_camera = new OrthographicCamera(-1, 1, 1, -1, -100, 100);
  }

  delete_element(elem)
  {
    const index = this.ui_elements.indexOf(elem);
    if (index > -1)
    {
      this.ui_elements.splice(index, 1);
    }

    this.ss_scene.remove(elem);
    this.ws_scene.remove(elem);

    elem.dispose();
  }

  add_screen_space_element(elem)
  {
    this.ui_elements.push(elem);
    this.ss_scene.add(elem);

    elem.set_screen_space_coordinate_system();
  }

  add_world_space_element(elem)
  {
    this.ui_elements.push(elem);
    this.ws_scene.add(elem);

    elem.set_world_space_coordinate_system();
  }

  update()
  {
    // this.ss_camera.left     = -Screen.width / 2;
    // this.ss_camera.right    = Screen.width / 2;
    // this.ss_camera.top      = Screen.top / 2;
    // this.ss_camera.right    = -Screen.bottom / 2;
    this.ss_camera.updateProjectionMatrix();

    this._tmp_normalized_pos.copy(Input.NDC);
    for (let i = 0; i < this.ui_elements.length; i++)
    {
      this.ui_elements[i].update_state(this._tmp_normalized_pos);
    }
  }

  render(renderer)
  {
    // renderer.render_ui(this.scene);
    if (this.ss_scene.children.length > 0)
    {
      Graphics.render(this.ss_scene, this.ss_camera);
    }
    if (this.ws_scene.children.length > 0)
    {
      Graphics.render(this.ws_scene, CameraManager.current);
    }
  }

  clear()
  {
    this.current_clicked_element = undefined;
  }
}

export default new UI();
