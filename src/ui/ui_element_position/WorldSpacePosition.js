import CameraManager from '../../CameraManager';
import * as THREE from 'three';

export default class WorldSpacePosition
{
  constructor()
  {
    this.tmp_vec3 = new THREE.Vector3();
    this.tmp_vec2 = new THREE.Vector2();
  }

  get_pos_NDC(position)
  {
    this.tmp_vec3.copy(position);
    this.tmp_vec3.project(CameraManager.current);

    return this.tmp_vec2.set(this.tmp_vec3.x, this.tmp_vec3.y);
  }
}
