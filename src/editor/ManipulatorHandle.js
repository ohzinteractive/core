import CameraManager from '../CameraManager';
import Input from '../Input';

import * as THREE from 'three';

export default class ManipulatorHandle extends THREE.Object3D
{
  constructor(direction, color)
  {
    super();

    let length = 10;
    this.arrow_helper = new THREE.ArrowHelper(direction, new THREE.Vector3(0, 0, 0), length, color, undefined, 1);
    this.add(this.arrow_helper);

    let collider_size = new THREE.Vector3();
    collider_size.x = THREE.Math.clamp(direction.x * length, 1, 30);
    collider_size.y = THREE.Math.clamp(direction.y * length, 1, 30);
    collider_size.z = THREE.Math.clamp(direction.z * length, 1, 30);

    var geometry = new THREE.BoxGeometry(collider_size.x, collider_size.y, collider_size.z);
    var material = new THREE.MeshBasicMaterial({ color: color, depthTest: false, depthWrite: false });
    material.visible = false;
    this.box_collider = new THREE.Mesh(geometry, material);
    this.box_collider.position.add(direction.clone().multiplyScalar(length * 0.5));
    this.add(this.box_collider);

    this.direction = direction;
    this.raycaster = new THREE.Raycaster();
    this.raycast_result = undefined;

    this.tmp_p1 = new THREE.Vector3(0, 0, 0);
    this.tmp_p2 = new THREE.Vector3(0, 0, 0);

    this.tmp_v2 = new THREE.Vector2(0, 0);

    this.half_unit_vec = new THREE.Vector3(0.5, 0.5, 0.5);
  }

  is_mouse_over()
  {
    this.raycaster.setFromCamera(Input.normalized_mouse_pos, CameraManager.current);
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
