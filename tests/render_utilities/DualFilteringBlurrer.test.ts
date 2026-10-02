import { describe, expect, it } from 'vitest';

import { Material } from 'three';

import { DualFilteringBlurMaterial } from '../../src/materials/DualFilteringBlurMaterial';
import { DualFilteringBlurrer } from '../../src/render_utilities/DualFilteringBlurrer';

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
});
