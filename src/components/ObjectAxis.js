import Arrow from '../primitives/Arrow';

import * as THREE from 'three';

export default class ObjectAxis extends THREE.Object3D
{
  constructor(obj, size)
  {
    super();
    size = size || 1.5;
    let right = new THREE.Vector3(1, 0, 0).applyQuaternion(obj.quaternion);
    let up = new THREE.Vector3(0, 1, 0).applyQuaternion(obj.quaternion);
    let forward = new THREE.Vector3(0, 0, 1).applyQuaternion(obj.quaternion);
    console.log(right, up, forward);
    this.add(new Arrow('#FF0000', size, right));
    this.add(new Arrow('#00FF00', size, up));
    this.add(new Arrow('#0000FF', size, forward));
  }
}
