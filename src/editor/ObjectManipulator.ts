import { ManipulatorHandle } from '../editor/ManipulatorHandle';

import { Object3D, Vector2, Vector3 } from 'three';

class ObjectManipulator extends Object3D
{
  active_handle: any;
  forward_handle: any;
  input: any;
  right_handle: any;
  target_obj: any;
  tmp_displacement_vector: any;
  tmp_local_pos: any;
  tmp_right_v2: any;
  tmp_up_v2: any;
  translation_sign: any;
  up_handle: any;
  use_vertical_translation: any;
  constructor(input: any)
  {
    super();
    this.input = input;
    this.target_obj = undefined;

    this.up_handle = new ManipulatorHandle(new Vector3(0, 1, 0), 0x00ff00, input);
    this.right_handle = new ManipulatorHandle(new Vector3(1, 0, 0), 0xff0000, input);
    this.forward_handle = new ManipulatorHandle(new Vector3(0, 0, 1), 0x0000ff, input);

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
        this.tmp_displacement_vector.multiplyScalar(-this.input.NDC_delta.y);
      }
      else
      {
        this.tmp_displacement_vector.multiplyScalar(this.input.NDC_delta.x);
      }

      this.tmp_displacement_vector.multiplyScalar(this.input.NDC_delta.length() * 250 * this.translation_sign);
      this.position.add(this.tmp_displacement_vector);

      this.tmp_local_pos.copy(this.position);
      this.target_obj.parent.worldToLocal(this.tmp_local_pos);
      this.target_obj.position.copy(this.tmp_local_pos);
    }
  }

  set_translation_axis(active_handle: any)
  {
    const vertical = active_handle.get_normalized_screen_direction().dot(this.tmp_up_v2);
    const horizontal = active_handle.get_normalized_screen_direction().dot(this.tmp_right_v2);

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
    if (this.input.left_mouse_button_down && this.active_handle === undefined)
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

    if (this.input.left_mouse_button_released)
    {
      this.active_handle = undefined;
    }
  }

  set_target(obj: any)
  {
    this.target_obj = obj;
    this.visible = true;
    obj.getWorldPosition(this.position);
  }
}

export { ObjectManipulator };
