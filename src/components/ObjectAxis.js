import Arrow from '../primitives/Arrow';

import { Object3D } from 'three';
import { Vector3 } from 'three';

export default class ObjectAxis extends Object3D
{
  constructor(obj, size)
  {
    super();
    size = size || 1.5;
    let right = new Vector3(1, 0, 0).applyQuaternion(obj.quaternion);
    let up = new Vector3(0, 1, 0).applyQuaternion(obj.quaternion);
    let forward = new Vector3(0, 0, 1).applyQuaternion(obj.quaternion);
    console.log(right, up, forward);
    this.add(new Arrow('#FF0000', size, right));
    this.add(new Arrow('#00FF00', size, up));
    this.add(new Arrow('#0000FF', size, forward));
  }
}
