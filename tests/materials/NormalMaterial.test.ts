import { describe, expect, it } from 'vitest';

import { NormalMaterial } from '../../src/materials/NormalMaterial';

describe('NormalMaterial', () =>
{
  it('is a TSL node material, not a GLSL ShaderMaterial', () =>
  {
    const material = new NormalMaterial();

    expect(material.isNodeMaterial).toBe(true);
    expect((material as unknown as { isShaderMaterial?: boolean }).isShaderMaterial).toBeUndefined();
    expect(material.colorNode).toBeTruthy();
  });

  it('is unlit, so lights in the scene do not tint the normals', () =>
  {
    const material = new NormalMaterial();

    expect(material.lights).toBe(false);
  });
});
