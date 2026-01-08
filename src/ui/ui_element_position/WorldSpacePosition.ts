import { CameraManager } from '../../CameraManager';

import { Vector2 } from 'three';
import { Vector3 } from 'three';

class WorldSpacePosition
{
  constructor()
  {
    this.tmp_vec3 = new Vector3();
    this.tmp_vec2 = new Vector2();
  }

  get_pos_NDC(position)
  {
    this.tmp_vec3.copy(position);
    this.tmp_vec3.project(CameraManager.current);

    return this.tmp_vec2.set(this.tmp_vec3.x, this.tmp_vec3.y);
  }
}

export { WorldSpacePosition };
