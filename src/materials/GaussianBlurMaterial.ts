import { BlitMaterial } from './BlitMaterial';

import frag from '../shaders/gaussian_blur/gaussian_blur.frag';

import { Vector2 } from 'three';

class GaussianBlurMaterial extends BlitMaterial
{
  constructor(kernel_radius)
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

  set_size(w, h)
  {
    this.uniforms.texSize.value.x = w;
    this.uniforms.texSize.value.y = h;
  }

  set_direction(x, y)
  {
    this.uniforms.direction.value.set(x, y);
  }

  set_radius(value = 1)
  {
    this.uniforms.radius.value = value;
  }
}

export { GaussianBlurMaterial };
