import { Color, PerspectiveCamera as TPerspectiveCamera } from 'three';

class PerspectiveCamera extends TPerspectiveCamera
{
  clear_alpha: number;
  clear_color: Color;
  /**
   * @param {number} fov
   * @param {number} aspect
   * @param {number} near
   * @param {number} far
   */
  constructor(fov: number, aspect: number, near: number, far: number)
  {
    super(fov, aspect, near, far);

    this.clear_color = new Color('#000000');
    this.clear_alpha = 1;
  }

  /**
   * @param {PerspectiveCamera} camera
   * @returns {this}
   */
  copy(camera: PerspectiveCamera): this
  {
    super.copy(camera);
    this.clear_color.copy(camera.clear_color);
    this.clear_alpha = camera.clear_alpha;
    return this;
  }
}

export { PerspectiveCamera };
