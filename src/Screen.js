// @ts-check
import { Vector2 } from 'three'; // eslint-disable-line
import { OScreen } from './OScreen';

class Screen
{
  init()
  {
    console.warn('Screen Singleton is deprecated. Please use OScreen.');
    OScreen.init();
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  update_position(x, y)
  {
    console.warn('Screen Singleton is deprecated. Please use OScreen.');
    OScreen.update_position(x, y);
  }

  update()
  {
    console.warn('Screen Singleton is deprecated. Please use OScreen.');
    OScreen.update();
  }

  /**
   * @param {number} width
   * @param {number} height
   */
  update_size(width, height)
  {
    console.warn('Screen Singleton is deprecated. Please use OScreen.');
    OScreen.update_size(width, height);
  }

  /**
   * @param {Vector2} vector2
   */
  apply_pixel_density_v2(vector2)
  {
    console.warn('Screen Singleton is deprecated. Please use OScreen.');
    return OScreen.apply_pixel_density_v2(vector2);
  }

  /**
   * @param {number} value
   */
  apply_pixel_density(value)
  {
    console.warn('Screen Singleton is deprecated. Please use OScreen.');
    return OScreen.apply_pixel_density(value);
  }

  get_pixel_size()
  {
    console.warn('Screen Singleton is deprecated. Please use OScreen.');
    return OScreen.get_pixel_size();
  }

  get aspect_ratio()
  {
    console.warn('Screen Singleton is deprecated. Please use OScreen.');
    return OScreen.aspect_ratio;
  }
}

const screen = new Screen();
export { screen as Screen };
