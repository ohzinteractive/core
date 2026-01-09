import { Color, PerspectiveCamera as TPerspectiveCamera } from 'three';

class PerspectiveCamera extends TPerspectiveCamera
{
  clear_alpha: any;
  clear_color: any;
  /**
   * @param {number} fov
   * @param {number} aspect
   * @param {number} near
   * @param {number} far
   */
  constructor(fov: any, aspect: any, near: any, far: any)
  {
    super(fov, aspect, near, far);

    this.clear_color = new Color('#000000');
    this.clear_alpha = 1;
  }

  /**
   * @param {PerspectiveCamera} camera
   * @returns {this}
   */
  copy(camera: any)
  {
    super.copy(camera);
    this.clear_color.copy(camera.clear_color);
    this.clear_alpha = camera.clear_alpha;
    return this;
  }
}

export { PerspectiveCamera };
