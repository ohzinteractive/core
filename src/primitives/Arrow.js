import Mesh from '/Mesh';
import * as THREE from 'three';

import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export default class Arrow extends Mesh
{
  constructor(color, length, dir)
  {
    color = color || '#FF0000';
    length = length || 1;

    let cone_height = 0.4;
    let cylinder_height = length - cone_height;
    let cylinder_geo = new THREE.CylinderBufferGeometry(0.01, 0.01, cylinder_height, 32);
    cylinder_geo.translate(0, cylinder_height / 2, 0);

    let cone_geometry = new THREE.ConeBufferGeometry(0.1, cone_height, 32);
    cone_geometry.translate(0, cylinder_height + cone_height / 2, 0);

    let buffer_geometry = BufferGeometryUtils.mergeBufferGeometries([cylinder_geo, cone_geometry]);
    buffer_geometry.rotateX(3.14 / 2);

    let material = new THREE.MeshBasicMaterial({ color: color });
    super(buffer_geometry, material);

    if (dir)
    {
      this.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    }
  }

  set dir(dir)
  {
    this.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
  }

  set length(value)
  {
    this.scale.z = value;
  }
}
