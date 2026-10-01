import { describe, expect, it } from 'vitest';

import { DataTexture, DoubleSide, NormalBlending, Vector3 } from 'three';

import { WorldImageMaterial } from '../../src/materials/WorldImageMaterial';

describe('WorldImageMaterial', () =>
{
  it('is a TSL node material, not a GLSL ShaderMaterial', () =>
  {
    const material = new WorldImageMaterial(new DataTexture(new Uint8Array(4), 1, 1));

    expect(material.isNodeMaterial).toBe(true);
    expect((material as unknown as { isShaderMaterial?: boolean }).isShaderMaterial).toBeUndefined();
    expect(material.vertexNode).toBeTruthy();
    expect(material.fragmentNode).toBeTruthy();
  });

  it('starts with the texture, world aligned, at scale 1 and fully opaque', () =>
  {
    const texture = new DataTexture(new Uint8Array(4), 1, 1);
    const material = new WorldImageMaterial(texture);

    expect(material.uniforms._MainTex.value).toBe(texture);
    expect(material.uniforms._ScreenAligned.value).toBe(0);
    expect(material.uniforms._Scale.value).toEqual(new Vector3(1, 1, 1));
    expect(material.uniforms._Opacity.value).toBe(1);
  });

  it('blends over the scene from both sides without writing depth', () =>
  {
    const material = new WorldImageMaterial(new DataTexture(new Uint8Array(4), 1, 1));

    expect(material.transparent).toBe(true);
    expect(material.blending).toBe(NormalBlending);
    expect(material.depthWrite).toBe(false);
    expect(material.depthTest).toBe(true);
    expect(material.side).toBe(DoubleSide);
  });
});
