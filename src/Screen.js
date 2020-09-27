import * as THREE from 'three';

class Screen
{
  constructor()
  {
    this.width = 1;
    this.height = 1;

    this.position = new THREE.Vector2();

    this.render_width = 1;
    this.render_height = 1;
    this.width_height = new THREE.Vector2(this.width, this.height);

    this.dpr = 1;
    this.pixel_size = new THREE.Vector2(1 / this.width, 1 / this.height);
  }

  update_position(x, y)
  {
    this.position.set(x, y);
  }

  update_size(width, height)
  {
    this.width = width;
    this.height = height;

    this.pixel_size = new THREE.Vector2(1 / this.width, 1 / this.height);

    this.width_height.x = width;
    this.width_height.y = height;

    this.render_width = width * this.dpr;
    this.render_height = height * this.dpr;
  }

  apply_pixel_density_v2(vector2)
  {
    vector2.multiplyScalar(1 / this.dpr);

    return vector2;
  }

  apply_pixel_density(value)
  {
    return value * (1 / this.dpr);
  }

  get_pixel_size()
  {
    return this.pixel_size;
  }

  get aspect_ratio()
  {
    return this.width / this.height;
  }
}

export default new Screen();
