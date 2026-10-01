import { describe, expect, it } from 'vitest';

import { Color, FrontSide, NormalBlending } from 'three';

import { LineMaterial } from '../../src/materials/LineMaterial';

describe('LineMaterial', () =>
{
  it('is a TSL node material, not a GLSL ShaderMaterial', () =>
  {
    const material = new LineMaterial();

    expect(material.isNodeMaterial).toBe(true);
    expect((material as unknown as { isShaderMaterial?: boolean }).isShaderMaterial).toBeUndefined();
    expect(material.vertexNode).toBeTruthy();
    expect(material.fragmentNode).toBeTruthy();
  });

  it('starts red and 0.2 thick, with _Length and _ElapsedTime at 0', () =>
  {
    const material = new LineMaterial();

    expect(material.uniforms._Thickness.value).toBe(0.2);
    expect(material.uniforms._Length.value).toBe(0);
    expect(material.uniforms._ElapsedTime.value).toBe(0);
    expect(material.uniforms._Color.value).toEqual(new Color('#FF0000'));
  });

  it('blends over the scene without writing depth, and ignores scene fog', () =>
  {
    const material = new LineMaterial();

    expect(material.transparent).toBe(true);
    expect(material.blending).toBe(NormalBlending);
    expect(material.depthWrite).toBe(false);
    expect(material.depthTest).toBe(true);
    expect(material.side).toBe(FrontSide);
    expect(material.fog).toBe(false);
  });
});
