import { CameraManager } from './CameraManager';
import { Graphics } from './Graphics';

import { Vector2 } from 'three';
import { OrthographicCamera } from './OrthographicCamera';
import type { Input } from './components/Input';
import type { UIElement } from './components/UIElement';
import { AbstractScene } from './scenes/AbstractScene';

class UI
{
  _tmp_normalized_pos: Vector2;
  current_clicked_element: UIElement | undefined;
  input: Input;
  ss_camera: OrthographicCamera;
  ss_scene: AbstractScene;
  ui_elements: UIElement[];
  ws_scene: AbstractScene;
  
  init(input: Input): void
  {
    this.input = input;
    this.ui_elements = []
    this._tmp_normalized_pos = new Vector2();
    this.ss_scene = new AbstractScene({ name: 'UI_screen_space_scene', compilators: {} });
    this.ss_scene.matrixWorldAutoUpdate = false;
    this.ss_scene.frustumCulled = false;

    this.ws_scene = new AbstractScene({ name: 'UI_world_space_scene', compilators: {} });
    this.ws_scene.matrixWorldAutoUpdate = false;
    this.ws_scene.frustumCulled = false;

    this.ss_camera = new OrthographicCamera(-1, 1, 1, -1, -100, 100);
  }

  delete_element(elem: UIElement): void
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

  add_screen_space_element(elem: UIElement): void
  {
    this.ui_elements.push(elem);
    this.ss_scene.add(elem);

    elem.set_screen_space_coordinate_system();
  }

  add_world_space_element(elem: UIElement): void
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
