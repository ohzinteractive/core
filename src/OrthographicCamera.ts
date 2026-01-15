import { Color, OrthographicCamera as TOrthographicCamera } from 'three';

class OrthographicCamera extends TOrthographicCamera
{
  clear_alpha: number;
  clear_color: Color;

  constructor(left: number, right: number, top: number, bottom: number, near: number, far: number)
  {
    super(left, right, top, bottom, near, far);

    this.clear_color = new Color('#000000');
    this.clear_alpha = 1;
  }

  copy(camera: OrthographicCamera): this
  {
    super.copy(camera);
    this.clear_color.copy(camera.clear_color);
    this.clear_alpha = camera.clear_alpha;
    return this;
  }
}

export { OrthographicCamera };
