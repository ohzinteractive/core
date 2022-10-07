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

  copy(camera)
  {
    super.copy(camera);
    this.clear_color.copy(camera.clear_color);
    this.clear_alpha = camera.clear_alpha;
    return this;
  }
}
