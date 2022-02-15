import CameraManager from '../CameraManager';
import Input from '../Input';

import { ArrowHelper } from 'three';
import { Vector2 } from 'three';
import { Vector3 } from 'three';
import { Object3D } from 'three';
import { BoxGeometry } from 'three';
import { MeshBasicMaterial } from 'three';
import { Mesh } from 'three';
import { Raycaster } from 'three';
import { Math as TMath } from 'three';

export default class ManipulatorHandle extends Object3D
{
  constructor(direction, color)
  {
    super();

    const length = 10;
    this.arrow_helper = new ArrowHelper(direction, new Vector3(0, 0, 0), length, color, undefined, 1);
    this.add(this.arrow_helper);

    const collider_size = new Vector3();
    collider_size.x = TMath.clamp(direction.x * length, 1, 30);
    collider_size.y = TMath.clamp(direction.y * length, 1, 30);
    collider_size.z = TMath.clamp(direction.z * length, 1, 30);

    const geometry = new BoxGeometry(collider_size.x, collider_size.y, collider_size.z);
    const material = new MeshBasicMaterial({ color: color, depthTest: false, depthWrite: false });
    material.visible = false;
    this.box_collider = new Mesh(geometry, material);
    this.box_collider.position.add(direction.clone().multiplyScalar(length * 0.5));
    this.add(this.box_collider);

    this.direction = direction;
    this.raycaster = new Raycaster();
    this.raycast_result = undefined;

    this.tmp_p1 = new Vector3(0, 0, 0);
    this.tmp_p2 = new Vector3(0, 0, 0);

    this.tmp_v2 = new Vector2(0, 0);

    this.half_unit_vec = new Vector3(0.5, 0.5, 0.5);
  }

  is_mouse_over()
  {
    this.raycaster.setFromCamera(Input.NDC, CameraManager.current);
    this.raycast_result = this.raycaster.intersectObject(this.box_collider);
    if (this.raycast_result.length > 0)
    {
      return true;
    }
    return false;
  }

  get_normalized_screen_direction()
  {
    this.getWorldPosition(this.tmp_p1);
    this.tmp_p2.copy(this.tmp_p1).add(this.direction);

    this.tmp_p1.project(CameraManager.current).multiplyScalar(0.5).add(this.half_unit_vec);
    this.tmp_p2.project(CameraManager.current).multiplyScalar(0.5).add(this.half_unit_vec);

    this.tmp_p2.sub(this.tmp_p1);
    return this.tmp_v2.copy(this.tmp_p2).normalize();
  }
}
