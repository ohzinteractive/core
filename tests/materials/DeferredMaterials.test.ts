import { describe, expect, it } from 'vitest';

import { AdditiveBlending, BackSide, Matrix4, RenderTarget, Vector3 } from 'three';

import { ClearDepthNormalMaterial } from '../../src/materials/ClearDepthNormalMaterial';
import { DepthNormalMaterial } from '../../src/materials/DepthNormalMaterial';
import { DeferredPointLightMaterial } from '../../src/materials/deferred/DeferredPointLightMaterial';

function expect_node_material(material: unknown)
{
  expect((material as { isNodeMaterial?: boolean }).isNodeMaterial).toBe(true);
  expect((material as { isShaderMaterial?: boolean }).isShaderMaterial).toBeUndefined();
}

describe('DepthNormalMaterial', () =>
{
  it('is a TSL node material, not a GLSL ShaderMaterial', () =>
  {
    const material = new DepthNormalMaterial();

    expect_node_material(material);
    expect(material.fragmentNode).toBeTruthy();
  });

  it('exposes the far plane used to normalize depth', () =>
  {
    const material = new DepthNormalMaterial();

    material.far_plane = 250;

    expect(material.far_plane).toBe(250);
    expect(material.uniforms._FarPlane.value).toBe(250);
  });
});

describe('ClearDepthNormalMaterial', () =>
{
  it('is a TSL node material holding the clear depth and normal', () =>
  {
    const material = new ClearDepthNormalMaterial(1, new Vector3(0, 0, 1));

    expect_node_material(material);
    expect(material.uniforms._DepthNormal.value.toArray()).toEqual([1, 0, 0, 1]);
  });
});

describe('DeferredPointLightMaterial', () =>
{
  it('is a TSL node material, not a GLSL ShaderMaterial', () =>
  {
    const material = new DeferredPointLightMaterial();

    expect_node_material(material);
    expect(material.colorNode).toBeTruthy();
  });

  it('draws light volumes additively from the inside, without writing depth', () =>
  {
    const material = new DeferredPointLightMaterial();

    expect(material.blending).toBe(AdditiveBlending);
    expect(material.side).toBe(BackSide);
    expect(material.depthWrite).toBe(false);
  });

  it('stores the intensity it was built with', () =>
  {
    expect(new DeferredPointLightMaterial(3).uniforms._Intensity.value).toBe(3);
  });

  it('feeds the G-buffer textures and inverse projection to its uniforms', () =>
  {
    const material = new DeferredPointLightMaterial();
    const albedo_rt = new RenderTarget(4, 4);
    const normal_depth_rt = new RenderTarget(4, 4);
    const inverse_proj = new Matrix4().makeScale(2, 3, 4);

    material.set_albedo_rt(albedo_rt);
    material.set_normal_depth_rt(normal_depth_rt);
    material.set_inverse_proj_matrix(inverse_proj);

    expect(material.uniforms._AlbedoTex.value).toBe(albedo_rt.texture);
    expect(material.uniforms._NormalDepthTex.value).toBe(normal_depth_rt.texture);
    expect(material.uniforms._InverseProjMatrix.value.equals(inverse_proj)).toBe(true);
    expect(material.uniforms._InverseProjMatrix.value).not.toBe(inverse_proj);
  });
});
