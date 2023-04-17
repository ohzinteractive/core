import { RaycastResolver } from '../../raycast/RaycastResolver';
import { GroupRaycaster } from '../../raycast/GroupRaycaster';

import { Vector3 } from 'three';
import { Quaternion } from 'three';

class ObjectRotator extends RaycastResolver
{
  constructor(object, input)
  {
    super();

    this.input = input;

    this.is_mouse_over = false;
    this.rotation_active = false;

    this.object = object;
    this.group_raycaster = new GroupRaycaster([object], this);
  }

  on_enter(intersected_object)
  {
    this.is_mouse_over = true;
  }

  on_exit()
  {
    this.is_mouse_over = false;
  }

  is_active()
  {
    return this.rotation_active;
  }

  update()
  {
    this.group_raycaster.update();

    if (this.is_mouse_over && this.input.left_mouse_button_down)
    {
      this.rotation_active = true;
    }

    // left button no longer being pressed
    if (!this.input.left_mouse_button_down)
    {
      this.rotation_active = false;
    }

    if (this.rotation_active)
    {
      const rot_x = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), this.input.NDC_delta.x);
      const rot_y = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), this.input.NDC_delta.y);

      this.object.quaternion.multiply(rot_x);
      rot_y.multiply(this.object.quaternion);
      this.object.quaternion.copy(rot_y);
    }
  }
}

export { ObjectRotator };
