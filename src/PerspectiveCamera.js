import { Color } from 'three';
import { PerspectiveCamera as THREEPerspectiveCamera } from 'three';

export default class PerspectiveCamera extends THREEPerspectiveCamera
{
  constructor(fov, aspect, near, far)
  {
    super(fov, aspect, near, far);

    this.clear_color = new Color('#000000');
    this.clear_alpha = 1;
  }
}
