import { describe, expect, it } from 'vitest';

import { DataTexture, DoubleSide, LinearFilter, NormalBlending, Texture, Vector2 } from 'three';

import { SDFTextMaterial } from '../../src/materials/SDFTextMaterial';

function atlas(): DataTexture
{
  return new DataTexture(new Uint8Array(4), 1, 1);
}

describe('SDFTextMaterial', () =>
{
  it('is a TSL node material, not a GLSL ShaderMaterial', () =>
  {
    const material = new SDFTextMaterial(atlas());

    expect(material.isNodeMaterial).toBe(true);
    expect((material as unknown as { isShaderMaterial?: boolean }).isShaderMaterial).toBeUndefined();
    expect(material.vertexNode).toBeTruthy();
    expect(material.fragmentNode).toBeTruthy();
  });

  it('starts with the atlas, a cutoff of 0.5 and a 1x1 atlas size', () =>
  {
    const texture = atlas();
    const material = new SDFTextMaterial(texture);

    expect(material.uniforms._Texture.value).toBe(texture);
    expect(material.uniforms._Boldness.value).toBe(0.5);
    expect(material.uniforms._AtlasSize.value).toEqual(new Vector2(1, 1));
  });

  it('blends over the scene from both sides without writing depth, and ignores scene fog', () =>
  {
    const material = new SDFTextMaterial(atlas());

    expect(material.transparent).toBe(true);
    expect(material.blending).toBe(NormalBlending);
    expect(material.depthWrite).toBe(false);
    expect(material.depthTest).toBe(true);
    expect(material.side).toBe(DoubleSide);
    expect(material.fog).toBe(false);
  });

  it('samples the atlas with linear filtering and no mipmaps', () =>
  {
    // A plain Texture starts with mipmaps on, so the material has something to change.
    const texture = new Texture();

    new SDFTextMaterial(texture);

    expect(texture.minFilter).toBe(LinearFilter);
    expect(texture.magFilter).toBe(LinearFilter);
    expect(texture.generateMipmaps).toBe(false);
  });

  it('set_atlas_size copies the size into _AtlasSize', () =>
  {
    const material = new SDFTextMaterial(atlas());
    const size = new Vector2(512, 256);

    material.set_atlas_size(size);
    size.set(0, 0);

    expect(material.uniforms._AtlasSize.value).toEqual(new Vector2(512, 256));
  });

  it('set_boldness maps 0..1 to a cutoff of 0.5..0.2', () =>
  {
    const material = new SDFTextMaterial(atlas());

    material.set_boldness(0);
    expect(material.uniforms._Boldness.value).toBe(0.5);

    material.set_boldness(1);
    expect(material.uniforms._Boldness.value).toBeCloseTo(0.2);

    material.set_boldness(0.5);
    expect(material.uniforms._Boldness.value).toBeCloseTo(0.35);
  });
});
