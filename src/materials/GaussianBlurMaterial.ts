import { BlitMaterial } from './BlitMaterial';

import frag from '../shaders/gaussian_blur/gaussian_blur.frag';

import { Vector2 } from 'three';

class GaussianBlurMaterial extends BlitMaterial
{
  constructor(kernel_radius: number)
  {
    super(frag, undefined, {
      KERNEL_RADIUS: kernel_radius,
      SIGMA: kernel_radius
    });

    this.uniforms.texSize = { value: new Vector2(0.5, 0.5) };
    this.uniforms.direction = { value: new Vector2(0.5, 0.5) };
    this.uniforms.radius = { value: 1 };

    this.defines.USE_LINEAR_COLOR_SPACE = true;
  }

  set_size(w: number, h: number)
  {
    (this.uniforms.texSize.value as Vector2).x = w;
    (this.uniforms.texSize.value as Vector2).y = h;
  }

  set_direction(x: number, y: number)
  {
    (this.uniforms.direction.value as Vector2).set(x, y);
  }

  set_radius(value = 1)
  {
    this.uniforms.radius.value = value;
  }
}

export { GaussianBlurMaterial };
