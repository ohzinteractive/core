import { BlitNodeMaterial } from './BlitNodeMaterial';

import { vec2 } from 'three/tsl';
import type { Node } from 'three/webgpu';

// [x, y, weight]: tap offsets in half source texels, as in the GLSL material.
type Tap = [number, number, number];

// The center plus the four diagonals.
const DOWNSAMPLE_TAPS: Tap[] = [
  [0, 0, 4],
  [-1, -1, 1], [1, 1, 1], [1, -1, 1], [-1, 1, 1]
];

// A ring of eight taps, where the diagonals weigh twice the side taps.
const UPSAMPLE_TAPS: Tap[] = [
  [-2, 0, 1], [-1, 1, 2], [0, 2, 1], [1, 1, 2],
  [2, 0, 1], [1, -1, 2], [0, -2, 1], [-1, -1, 2]
];

// One pass of the dual filtering (Kawase) blur. Taps land between texels, so the
// linear filter averages several texels per fetch. Both kernels are symmetric, so
// render targets (top left origin) and regular textures blur the same.
class DualFilteringBlurMaterial extends BlitNodeMaterial
{
  constructor(upsample: boolean)
  {
    super();

    // Blitter sets _Resolution to the source size on every blit.
    const half_pixel = vec2(0.5).div(this.uniforms._Resolution as unknown as Node<'vec2'>);
    const taps = upsample ? UPSAMPLE_TAPS : DOWNSAMPLE_TAPS;

    const weighted_taps = taps.map(([x, y, weight]) => this.sample_main_tex(half_pixel.mul(vec2(x, y))).mul(weight));
    const weight_sum = taps.reduce((sum, [, , weight]) => sum + weight, 0);

    this.fragmentNode = weighted_taps.reduce((sum, tap) => sum.add(tap)).div(weight_sum);
  }
}

export { DualFilteringBlurMaterial };
