import { describe, expect, it } from 'vitest';

import { Material } from 'three';

import { DualFilteringBlurMaterial } from '../../src/materials/DualFilteringBlurMaterial';
import { DualFilteringBlurrer } from '../../src/render_utilities/DualFilteringBlurrer';

function target_sizes(blurrer: DualFilteringBlurrer): string[]
{
  return [blurrer.RT0, blurrer.RT1, blurrer.RT2, blurrer.RT3, blurrer.RT4].map(target => `${target.width}x${target.height}`);
}

describe('DualFilteringBlurrer', () =>
{
  it('blurs with TSL materials only', () =>
  {
    const blurrer = new DualFilteringBlurrer();
    const materials = Object.values(blurrer).filter(value => value instanceof Material);

    expect(blurrer.downscale_blur_mat).toBeInstanceOf(DualFilteringBlurMaterial);
    expect(blurrer.upscale_blur_mat).toBeInstanceOf(DualFilteringBlurMaterial);
    expect(materials.every(material => (material as { isNodeMaterial?: boolean }).isNodeMaterial === true)).toBe(true);
    expect(blurrer).not.toHaveProperty('alpha_filter_mat');
  });

  it('sizes its targets to a half, a quarter, an eighth and a sixteenth of the input', () =>
  {
    const blurrer = new DualFilteringBlurrer();

    blurrer.check_RT_resize(256, 128);

    expect(target_sizes(blurrer)).toEqual(['128x64', '128x64', '64x32', '32x16', '16x8']);
  });

  it('rounds the target sizes down to whole pixels, and never below one', () =>
  {
    const blurrer = new DualFilteringBlurrer();

    blurrer.check_RT_resize(100, 8);

    expect(target_sizes(blurrer)).toEqual(['50x4', '50x4', '25x2', '12x1', '6x1']);
  });
});
