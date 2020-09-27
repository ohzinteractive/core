import * as THREE from 'three';

export default class ScreenSpacePosition
{
  constructor()
  {
    this.tmp_vec = new THREE.Vector2();
  }

  get_pos_NDC(position)
  {
    return this.tmp_vec.set(position.x, position.y);
  }
}
