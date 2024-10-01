// @ts-check
import { Color } from 'three';
import { OrthographicCamera as TOrthographicCamera } from 'three';

class OrthographicCamera extends TOrthographicCamera
{
  /**
   * @param {number} left
   * @param {number} right
   * @param {number} top
   * @param {number} bottom
   * @param {number} near
   * @param {number} far
   */
  constructor(left, right, top, bottom, near, far)
  {
    super(left, right, top, bottom, near, far);

    this.clear_color = new Color('#000000');
    this.clear_alpha = 1;
  }

  /**
   * @param {OrthographicCamera} camera
   * @returns {this}
   */
  copy(camera)
  {
    super.copy(camera);
    this.clear_color.copy(camera.clear_color);
    this.clear_alpha = camera.clear_alpha;
    return this;
  }
}

export { OrthographicCamera };
