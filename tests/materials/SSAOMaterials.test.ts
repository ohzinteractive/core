import { describe, expect, it } from 'vitest';

import { DataTexture, Matrix4, RGBAFormat, RenderTarget, RepeatWrapping } from 'three';

import { SSAOComposeMaterial } from '../../src/materials/SSAOComposeMaterial';
import { SSAOMaterial } from '../../src/materials/SSAOMaterial';

function expect_node_material(material: unknown)
{
  expect((material as { isNodeMaterial?: boolean }).isNodeMaterial).toBe(true);
  expect((material as { isShaderMaterial?: boolean }).isShaderMaterial).toBeUndefined();
}

describe('SSAOMaterial', () =>
{
  it('is a TSL node material, not a GLSL ShaderMaterial', () =>
  {
    const material = new SSAOMaterial();

    expect_node_material(material);
    expect(material.fragmentNode).toBeTruthy();
  });

  it('reads depth exactly unless told to use one filtered fetch per sample', () =>
  {
    const exact = new SSAOMaterial();
    const filtered = new SSAOMaterial(false);

    expect(exact.use_exact_depth).toBe(true);
    expect(filtered.use_exact_depth).toBe(false);
    expect(filtered.fragmentNode).toBeTruthy();
  });

  it('starts with the bias and radius of the GLSL version', () =>
  {
    const material = new SSAOMaterial();

    expect(material.uniforms._Bias.value).toBe(0.0125);
    expect(material.uniforms._Radius.value).toBe(0.3);
  });

  it('samples 64 points in the unit hemisphere around the normal, denser near the center', () =>
  {
    const kernel = new SSAOMaterial().sample_kernel;

    expect(kernel).toHaveLength(64);

    for (const sample of kernel)
    {
      expect(sample.z).toBeGreaterThanOrEqual(0);
      expect(sample.length()).toBeGreaterThanOrEqual(0.1 - 1e-6);
      expect(sample.length()).toBeLessThanOrEqual(1 + 1e-6);
    }

    const mean_length = (samples: typeof kernel) => samples.reduce((sum, s) => sum + s.length(), 0) / samples.length;

    expect(mean_length(kernel.slice(0, 32))).toBeLessThan(mean_length(kernel.slice(32)));
  });

  it('rotates the kernel with a tiling 4x4 noise texture holding a full RGBA texel per pixel', () =>
  {
    const noise = new SSAOMaterial().uniforms._RandomRotation.value as DataTexture;

    expect(noise).toBeInstanceOf(DataTexture);
    expect(noise.image.width).toBe(4);
    expect(noise.image.height).toBe(4);
    expect(noise.format).toBe(RGBAFormat);
    expect(noise.image.data).toHaveLength(4 * 4 * 4);
    expect(noise.wrapS).toBe(RepeatWrapping);
    expect(noise.wrapT).toBe(RepeatWrapping);

    for (let i = 0; i < 16; i++)
    {
      // Random xy, no z: the rotation stays around the normal.
      expect(noise.image.data[i * 4 + 2]).toBe(0);
      expect(noise.image.data[i * 4 + 3]).toBe(255);
    }
  });

  it('copies the camera projection and its inverse into its uniforms', () =>
  {
    const material = new SSAOMaterial();
    const projection = new Matrix4().makePerspective(-1, 1, 1, -1, 0.1, 100);

    material.set_projection_matrix(projection);

    expect(material.uniforms._ProjectionMatrix.value.equals(projection)).toBe(true);
    expect(material.uniforms._ProjectionMatrix.value).not.toBe(projection);
    expect(material.uniforms._InverseProjMatrix.value.equals(projection.clone().invert())).toBe(true);
  });
});

describe('SSAOComposeMaterial', () =>
{
  it('is a TSL node material, not a GLSL ShaderMaterial', () =>
  {
    const material = new SSAOComposeMaterial();

    expect_node_material(material);
    expect(material.fragmentNode).toBeTruthy();
  });

  it('takes the occlusion texture through its _AO uniform', () =>
  {
    const material = new SSAOComposeMaterial();
    const ao_rt = new RenderTarget(4, 4);

    material.uniforms._AO.value = ao_rt.texture;

    expect(material.uniforms._AO.value).toBe(ao_rt.texture);
  });
});
