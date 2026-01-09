import { CameraManager } from './CameraManager';
import { Graphics } from './Graphics';

import { Scene, Vector2 } from 'three';
import { OrthographicCamera } from './OrthographicCamera';
import { UIElement } from './components/UIElement';

class UI
{
  _tmp_normalized_pos: any;
  current_clicked_element: any;
  input: any;
  ss_camera: any;
  ss_scene: any;
  ui_elements: any;
  ws_scene: any;
  init(input: any)
  {
    this.input = input;
    this.ui_elements = []
    this._tmp_normalized_pos = new Vector2();
    this.ss_scene = new Scene();
    this.ss_scene.matrixWorldAutoUpdate = false;
    this.ss_scene.frustumCulled = false;

    this.ws_scene = new Scene();
    this.ws_scene.matrixWorldAutoUpdate = false;
    this.ws_scene.frustumCulled = false;

    this.ss_camera = new OrthographicCamera(-1, 1, 1, -1, -100, 100);
  }

  delete_element(elem: UIElement)
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

  add_screen_space_element(elem: UIElement)
  {
    this.ui_elements.push(elem);
    this.ss_scene.add(elem);

    elem.set_screen_space_coordinate_system();
  }

  add_world_space_element(elem: UIElement)
  {
    this.ui_elements.push(elem);
    this.ws_scene.add(elem);

    elem.set_world_space_coordinate_system();
  }

  update()
  {
    // this.ss_camera.left     = -OScreen.width / 2;
    // this.ss_camera.right    = OScreen.width / 2;
    // this.ss_camera.top      = OScreen.top / 2;
    // this.ss_camera.right    = -OScreen.bottom / 2;
    this.ss_camera.updateProjectionMatrix();

    this._tmp_normalized_pos.copy(this.input.NDC);
    for (let i = 0; i < this.ui_elements.length; i++)
    {
      this.ui_elements[i].update_state(this._tmp_normalized_pos);
    }
  }

  render()
  {
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

const ui = new UI();
export { ui as UI };
