import { Vector2 } from 'three';

class OScreen
{
  dpr: number;
  height: number;
  pixel_size: Vector2;
  position: Vector2;
  render_height: number;
  render_width: number;
  size_changed: boolean;
  width: number;
  width_height: Vector2;
  init()
  {
    this.width = 1;
    this.height = 1;

    this.position = new Vector2();

    this.render_width = 1;
    this.render_height = 1;
    this.width_height = new Vector2(this.width, this.height);

    this.dpr = 1;
    this.pixel_size = new Vector2(1 / this.width, 1 / this.height);
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  update_position(x: number, y: number)
  {
    this.position.set(x, y);
  }

  update()
  {
    this.size_changed = false;
  }

  /**
   * @param {number} width
   * @param {number} height
   */
  update_size(width: number, height: number)
  {
    this.width = width;
    this.height = height;

    this.pixel_size = new Vector2(1 / this.width, 1 / this.height);

    this.width_height.x = width;
    this.width_height.y = height;

    this.render_width = width * this.dpr;
    this.render_height = height * this.dpr;

    this.size_changed = true;
  }

  /**
   * @param {Vector2} vector2
   */
  apply_pixel_density_v2(vector2: Vector2)
  {
    vector2.multiplyScalar(1 / this.dpr);

    return vector2;
  }

  /**
   * @param {number} value
   */
  apply_pixel_density(value: number)
  {
    return value * (1 / this.dpr);
  }

  get_pixel_size(): Vector2
  {
    return this.pixel_size;
  }
  
  get aspect_ratio(): number
  {
    return this.width / this.height;
  }
  
  get portrait()
  {
    return this.width < this.height;
  }
}

const oscreen = new OScreen();
export { oscreen as OScreen };
