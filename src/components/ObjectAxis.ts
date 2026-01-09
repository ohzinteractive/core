import { Arrow } from '../primitives/Arrow';

import { Object3D, Vector3 } from 'three';

class ObjectAxis extends Object3D
{
  /**
   * @param {Object3D} obj
   * @param {number} [size]
   */
  constructor(obj: any, size: any)
  {
    super();
    size = size || 1.5;
    const right = new Vector3(1, 0, 0).applyQuaternion(obj.quaternion);
    const up = new Vector3(0, 1, 0).applyQuaternion(obj.quaternion);
    const forward = new Vector3(0, 0, 1).applyQuaternion(obj.quaternion);
    console.log(right, up, forward);
    this.add(new Arrow('#FF0000', size, right));
    this.add(new Arrow('#00FF00', size, up));
    this.add(new Arrow('#0000FF', size, forward));
  }
}

export { ObjectAxis };
