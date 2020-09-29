import RaycastResolver from '../../raycast/RaycastResolver';
import GroupRaycaster from '../../raycast/GroupRaycaster';
import Input from '../../Input';

import * as THREE from 'three';

export default class ObjectRotator extends RaycastResolver
{
  constructor(object)
  {
    super();

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

    if (this.is_mouse_over && Input.left_mouse_button_down)
    {
      this.rotation_active = true;
    }

    // left button no longer being pressed
    if (!Input.left_mouse_button_down)
    {
      this.rotation_active = false;
    }

    if (this.rotation_active)
    {
      let rot_x = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Input.mouse_dir.x);
      let rot_y = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Input.mouse_dir.y);

      this.object.quaternion.multiply(rot_x);
      rot_y.multiply(this.object.quaternion);
      this.object.quaternion.copy(rot_y);
    }
  }
}
