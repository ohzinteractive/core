import { BlitNodeMaterial } from './BlitNodeMaterial';

import { Vector2 } from 'three';
import { uniform, vec2 } from 'three/tsl';

function gaussian_pdf(x: number, sigma: number)
{
  return 0.39894 * Math.exp(-0.5 * x * x / (sigma * sigma)) / sigma;
}

// One separable pass of a gaussian blur along direction. The kernel is fixed per
// material, so its weights are computed here and the taps are unrolled into the graph.
class GaussianBlurMaterial extends BlitNodeMaterial
{
  constructor(kernel_radius: number)
  {
    super();

    const tex_size = uniform(new Vector2(0.5, 0.5));
    const direction = uniform(new Vector2(0.5, 0.5));
    const radius = uniform(1);

    this.uniforms.texSize = tex_size;
    this.uniforms.direction = direction;
    this.uniforms.radius = radius;

    const sigma = kernel_radius;
    const step = direction.mul(vec2(1).div(tex_size)).mul(radius);

    let weight_sum = gaussian_pdf(0, sigma);
    let color_sum = this.sample_main_tex().mul(weight_sum);

    for (let i = 1; i < kernel_radius; i++)
    {
      const weight = gaussian_pdf(i, sigma);
      const offset = step.mul(i);
      const pair = this.sample_main_tex(offset).add(this.sample_main_tex(offset.negate()));

      color_sum = color_sum.add(pair.mul(weight));
      weight_sum += 2 * weight;
    }

    this.fragmentNode = color_sum.div(weight_sum);
  }

  set_size(w: number, h: number)
  {
    (this.uniforms.texSize.value as Vector2).set(w, h);
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
