import { describe, expect, it } from 'vitest';

import { Color, NoBlending, Texture, Vector2 } from 'three';

import { AddMaterial } from '../../src/materials/AddMaterial';
import { BlitNodeMaterial } from '../../src/materials/BlitNodeMaterial';
import { GaussianBlurMaterial } from '../../src/materials/GaussianBlurMaterial';
import { LuminosityHighPassMaterial } from '../../src/materials/LuminosityHighPassMaterial';
import { UnrealBloomComposeMaterial } from '../../src/materials/UnrealBloomComposeMaterial';
import { GaussianBlurrer } from '../../src/render_utilities/GaussianBlurrer';

const MATERIALS = [
  { name: 'AddMaterial', create: () => new AddMaterial() },
  { name: 'GaussianBlurMaterial', create: () => new GaussianBlurMaterial(5) },
  { name: 'LuminosityHighPassMaterial', create: () => new LuminosityHighPassMaterial() },
  { name: 'UnrealBloomComposeMaterial', create: () => new UnrealBloomComposeMaterial(5) }
];

describe.each(MATERIALS)('$name', ({ create }) =>
{
  it('is a TSL blit node material, not a GLSL ShaderMaterial', () =>
  {
    const material = create();

    expect(material).toBeInstanceOf(BlitNodeMaterial);
    expect(material.isNodeMaterial).toBe(true);
    expect((material as unknown as { isShaderMaterial?: boolean }).isShaderMaterial).toBeUndefined();
    expect(material.fragmentNode).toBeTruthy();
  });

  it('draws a full screen pass without depth or blending', () =>
  {
    const material = create();

    expect(material.depthTest).toBe(false);
    expect(material.depthWrite).toBe(false);
    expect(material.blending).toBe(NoBlending);
  });
});

describe('AddMaterial', () =>
{
  it('stores the texture added on top of _MainTex', () =>
  {
    const material = new AddMaterial(true);
    const second = new Texture();

    material.set_add_texture(second);

    expect(material.uniforms._SecondTex.value).toBe(second);
  });
});

describe('GaussianBlurMaterial', () =>
{
  it('drives size, direction and radius through uniforms', () =>
  {
    const material = new GaussianBlurMaterial(3);

    material.set_size(320, 240);
    material.set_direction(0, 1);
    material.set_radius(2);

    expect(material.uniforms.texSize.value).toEqual(new Vector2(320, 240));
    expect(material.uniforms.direction.value).toEqual(new Vector2(0, 1));
    expect(material.uniforms.radius.value).toBe(2);
  });

  it('defaults the radius to 1', () =>
  {
    const material = new GaussianBlurMaterial(3);

    material.set_radius(4);
    material.set_radius();

    expect(material.uniforms.radius.value).toBe(1);
  });
});

describe('LuminosityHighPassMaterial', () =>
{
  it('drives the threshold through a uniform', () =>
  {
    const material = new LuminosityHighPassMaterial();

    expect(material.uniforms.luminosityThreshold.value).toBe(0.23);

    material.set_threshold(0.8);

    expect(material.uniforms.luminosityThreshold.value).toBe(0.8);
    expect(material.uniforms.smoothWidth.value).toBe(0.01);
    expect(material.uniforms.defaultColor.value).toEqual(new Color('#000000'));
    expect(material.uniforms.defaultOpacity.value).toBe(0);
  });
});

describe('UnrealBloomComposeMaterial', () =>
{
  it('binds one blur texture per mip', () =>
  {
    const material = new UnrealBloomComposeMaterial(5);
    const textures = [new Texture(), new Texture(), new Texture(), new Texture(), new Texture()];

    material.set_blur_texture_0(textures[0]);
    material.set_blur_texture_1(textures[1]);
    material.set_blur_texture_2(textures[2]);
    material.set_blur_texture_3(textures[3]);
    material.set_blur_texture_4(textures[4]);

    expect(material.uniforms.blurTexture1.value).toBe(textures[0]);
    expect(material.uniforms.blurTexture2.value).toBe(textures[1]);
    expect(material.uniforms.blurTexture3.value).toBe(textures[2]);
    expect(material.uniforms.blurTexture4.value).toBe(textures[3]);
    expect(material.uniforms.blurTexture5.value).toBe(textures[4]);
  });

  it('drives strength and radius through uniforms', () =>
  {
    const material = new UnrealBloomComposeMaterial(5);

    material.set_bloom_strength(2.5);
    material.set_bloom_radius(0.3);

    expect(material.uniforms.bloomStrength.value).toBe(2.5);
    expect(material.uniforms.bloomRadius.value).toBe(0.3);
  });

  it('tints each mip independently, starting from white', () =>
  {
    const material = new UnrealBloomComposeMaterial(5);
    const tints = material.uniforms.bloomTintColors.value as Color[];

    expect(tints).toHaveLength(5);
    expect(tints.every((tint) => tint.equals(new Color('#ffffff')))).toBe(true);

    material.set_tint_color_0('#ff0000');
    material.set_tint_color_4('#0000ff');

    expect(tints[0]).toEqual(new Color('#ff0000'));
    expect(tints[1]).toEqual(new Color('#ffffff'));
    expect(tints[4]).toEqual(new Color('#0000ff'));
  });
});

describe('GaussianBlurrer', () =>
{
  it('builds its passes from TSL materials', () =>
  {
    const blurrer = new GaussianBlurrer();

    expect(blurrer.luminosity_high_pass_mat.isNodeMaterial).toBe(true);
    expect(blurrer.separableBlurMaterials).toHaveLength(blurrer.nMips);
    expect(blurrer.separableBlurMaterials.every((material) => material.isNodeMaterial)).toBe(true);
  });

  it('forwards radius and threshold to its materials', () =>
  {
    const blurrer = new GaussianBlurrer();

    blurrer.set_radius(3);
    blurrer.set_luminosity_threshold(0.7);

    expect(blurrer.separableBlurMaterials.every((material) => material.uniforms.radius.value === 3)).toBe(true);
    expect(blurrer.luminosity_high_pass_mat.uniforms.luminosityThreshold.value).toBe(0.7);
  });
});
