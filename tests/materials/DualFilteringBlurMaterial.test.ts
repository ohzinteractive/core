import { describe, expect, it } from 'vitest';

import { NoBlending, Texture, Vector2 } from 'three';

import { BlitNodeMaterial } from '../../src/materials/BlitNodeMaterial';
import { DualFilteringBlurMaterial } from '../../src/materials/DualFilteringBlurMaterial';

for (const upsample of [false, true])
{
  describe(`DualFilteringBlurMaterial (${upsample ? 'upsample' : 'downsample'})`, () =>
  {
    it('is a blit node material, not a GLSL ShaderMaterial', () =>
    {
      const material = new DualFilteringBlurMaterial(upsample);

      expect(material).toBeInstanceOf(BlitNodeMaterial);
      expect((material as unknown as { isShaderMaterial?: boolean }).isShaderMaterial).toBeUndefined();
      expect(material.fragmentNode).toBeTruthy();
    });

    it('keeps the blit uniforms that Blitter writes', () =>
    {
      const material = new DualFilteringBlurMaterial(upsample);
      const texture = new Texture();

      material.uniforms._MainTex.value = texture;
      material.uniforms._Resolution.value.set(32, 16);

      expect(material.uniforms._MainTex.value).toBe(texture);
      expect(material.uniforms._Resolution.value).toEqual(new Vector2(32, 16));
      expect(material.uniforms._TargetResolution.value).toBeInstanceOf(Vector2);
    });

    it('draws a full screen pass without depth or blending', () =>
    {
      const material = new DualFilteringBlurMaterial(upsample);

      expect(material.depthTest).toBe(false);
      expect(material.depthWrite).toBe(false);
      expect(material.blending).toBe(NoBlending);
    });
  });
}
