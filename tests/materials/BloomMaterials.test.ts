import { describe, expect, it } from 'vitest';

import { CustomBlending, NoBlending, OneFactor, Texture, Vector2 } from 'three';

import { BlitNodeMaterial } from '../../src/materials/BlitNodeMaterial';
import { BloomComposeMaterial } from '../../src/materials/BloomComposeMaterial';
import { BoxBlurMaterial } from '../../src/materials/BoxBlurMaterial';

describe('BlitNodeMaterial', () =>
{
  it('is a TSL node material, not a GLSL ShaderMaterial', () =>
  {
    const material = new BlitNodeMaterial();

    expect(material.isNodeMaterial).toBe(true);
    expect((material as unknown as { isShaderMaterial?: boolean }).isShaderMaterial).toBeUndefined();
    expect(material.vertexNode).toBeTruthy();
    expect(material.fragmentNode).toBeTruthy();
  });

  it('exposes the blit uniforms through the same uniforms.<name>.value contract as BlitMaterial', () =>
  {
    const material = new BlitNodeMaterial();
    const texture = new Texture();

    material.uniforms._MainTex.value = texture;
    material.uniforms._Resolution.value.set(640, 480);

    expect(material.uniforms._MainTex.value).toBe(texture);
    expect(material.uniforms._Resolution.value).toEqual(new Vector2(640, 480));
    expect(material.uniforms._TargetResolution.value).toBeInstanceOf(Vector2);
  });

  it('draws a full screen pass without depth or blending', () =>
  {
    const material = new BlitNodeMaterial();

    expect(material.depthTest).toBe(false);
    expect(material.depthWrite).toBe(false);
    expect(material.blending).toBe(NoBlending);
  });
});

describe('BoxBlurMaterial', () =>
{
  it('is a blit node material with a sample direction', () =>
  {
    const material = new BoxBlurMaterial();

    expect(material).toBeInstanceOf(BlitNodeMaterial);

    material.uniforms._SampleDir.value.set(0, 1);
    expect(material.uniforms._SampleDir.value).toEqual(new Vector2(0, 1));
  });
});

describe('BloomComposeMaterial', () =>
{
  it('is a blit node material with the blurred texture and bloom strength', () =>
  {
    const material = new BloomComposeMaterial();
    const blurred = new Texture();

    material.uniforms._BlurredTex.value = blurred;

    expect(material).toBeInstanceOf(BlitNodeMaterial);
    expect(material.uniforms._BlurredTex.value).toBe(blurred);
    expect(material.uniforms._BloomStrength.value).toBe(1);
    expect(material.blending).toBe(NoBlending);
  });

  it('adds the blur on top of the destination when alpha blending is requested', () =>
  {
    const material = new BloomComposeMaterial(true);

    expect(material.blending).toBe(CustomBlending);
    expect(material.blendSrc).toBe(OneFactor);
    expect(material.blendDst).toBe(OneFactor);
  });
});
