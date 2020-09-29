import ManipulatorHandle from '../editor/ManipulatorHandle';
import Input from '../Input';
import EventManager from '../EventManager';

import { Object3D } from 'three';
import { Vector2 } from 'three';
import { Vector3 } from 'three';

export default class ObjectManipulator extends Object3D
{
  constructor()
  {
    super();
    this.target_obj = undefined;

    this.up_handle = new ManipulatorHandle(new Vector3(0, 1, 0), 0x00ff00);
    this.right_handle = new ManipulatorHandle(new Vector3(1, 0, 0), 0xff0000);
    this.forward_handle = new ManipulatorHandle(new Vector3(0, 0, 1), 0x0000ff);

    this.add(this.up_handle);
    this.add(this.right_handle);
    this.add(this.forward_handle);

    this.active_handle = undefined;

    this.tmp_displacement_vector = new Vector3();
    this.tmp_local_pos = new Vector3();

    this.target_obj = undefined;

    this.tmp_up_v2 = new Vector2(0, 1);
    this.tmp_right_v2 = new Vector2(1, 0);

    this.use_vertical_translation = false;
    this.translation_sign = false;

    this.visible = false;
  }

  update()
  {
    this.check_active_handle();

    if (this.active_handle && this.target_obj)
    {
      this.tmp_displacement_vector.copy(this.active_handle.direction);
      if (this.use_vertical_translation)
      {
        this.tmp_displacement_vector.multiplyScalar(-Input.mouse_dir.y);
      }
      else
      {
        this.tmp_displacement_vector.multiplyScalar(Input.mouse_dir.x);
      }

      this.tmp_displacement_vector.multiplyScalar(Input.mouse_dir.length() * 250 * this.translation_sign);
      this.position.add(this.tmp_displacement_vector);

      this.tmp_local_pos.copy(this.position);
      this.target_obj.parent.worldToLocal(this.tmp_local_pos);
      this.target_obj.position.copy(this.tmp_local_pos);
      let scope = this;
      EventManager.fire_unit_position_updated({
        unit_id: scope.target_obj.name,
        position: scope.target_obj.position
      });
    }
  }

  set_translation_axis(active_handle)
  {
    let vertical = active_handle.get_normalized_screen_direction().dot(this.tmp_up_v2);
    let horizontal = active_handle.get_normalized_screen_direction().dot(this.tmp_right_v2);

    if (Math.abs(vertical) > Math.abs(horizontal))
    {
      this.use_vertical_translation = true;
      this.translation_sign = Math.sign(vertical);
    }
    else
    {
      this.use_vertical_translation = false;
      this.translation_sign = Math.sign(horizontal);
    }
  }

  check_active_handle()
  {
    if (Input.left_mouse_button_down && this.active_handle === undefined)
    {
      if (this.right_handle.is_mouse_over())
      {
        this.active_handle = this.right_handle;
      }
      if (this.forward_handle.is_mouse_over())
      {
        this.active_handle = this.forward_handle;
      }

      if (this.active_handle)
      {
        this.set_translation_axis(this.active_handle);
      }
    }

    if (Input.is_mouse_up)
    {
      this.active_handle = undefined;
    }
  }

  set_target(obj)
  {
    this.target_obj = obj;
    this.visible = true;
    obj.getWorldPosition(this.position);
  }
}
