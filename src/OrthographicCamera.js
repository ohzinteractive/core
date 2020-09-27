import * as THREE from 'three';

export default class OrthographicCamera extends THREE.OrthographicCamera
{
  constructor(left, right, top, bottom, near, far)
  {
    super(left, right, top, bottom, near, far);

    this.clear_color = new THREE.Color('#000000');
    this.clear_alpha = 1;
  }
}
