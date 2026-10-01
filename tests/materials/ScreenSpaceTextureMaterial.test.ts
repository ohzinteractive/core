import { describe, expect, it } from 'vitest';

import { DataTexture, NoBlending, RenderTarget, Vector2 } from 'three';

import { BlitNodeMaterial } from '../../src/materials/BlitNodeMaterial';
import { ScreenSpaceTextureMaterial } from '../../src/materials/ScreenSpaceTextureMaterial';

describe('ScreenSpaceTextureMaterial', () =>
{
  it('is a blit node material, not a GLSL ShaderMaterial', () =>
  {
    const material = new ScreenSpaceTextureMaterial();

    expect(material).toBeInstanceOf(BlitNodeMaterial);
    expect(material.isNodeMaterial).toBe(true);
    expect((material as unknown as { isShaderMaterial?: boolean }).isShaderMaterial).toBeUndefined();
    expect(material.vertexNode).toBeTruthy();
    expect(material.fragmentNode).toBeTruthy();
  });

  it('set_texture writes the texture and its image size, and w and h override that size', () =>
  {
    const material = new ScreenSpaceTextureMaterial();
    const texture = new DataTexture(new Uint8Array(8 * 4 * 4), 8, 4);

    material.set_texture(texture, undefined, undefined);

    expect(material.uniforms._MainTex.value).toBe(texture);
    expect(material.uniforms._TextureSize.value).toEqual(new Vector2(8, 4));

    material.set_texture(texture, 32, 16);

    expect(material.uniforms._TextureSize.value).toEqual(new Vector2(32, 16));
  });

  it('set_texture reads the size of a render target texture', () =>
  {
    const material = new ScreenSpaceTextureMaterial();
    const render_target = new RenderTarget(64, 32);

    material.set_texture(render_target.texture, undefined, undefined);

    expect(material.uniforms._MainTex.value).toBe(render_target.texture);
    expect(material.uniforms._TextureSize.value).toEqual(new Vector2(64, 32));
  });

  it('set_position and set_screen_size write their uniforms', () =>
  {
    const material = new ScreenSpaceTextureMaterial();

    material.set_position(10, 20);
    material.set_screen_size(640, 480);

    expect(material.uniforms._ScreenSpacePosition.value).toEqual(new Vector2(10, 20));
    expect(material.uniforms._ScreenSize.value).toEqual(new Vector2(640, 480));
  });

  it('draws over everything, without depth or blending', () =>
  {
    const material = new ScreenSpaceTextureMaterial();

    expect(material.depthTest).toBe(false);
    expect(material.depthWrite).toBe(false);
    expect(material.transparent).toBe(false);
    expect(material.blending).toBe(NoBlending);
  });
});
