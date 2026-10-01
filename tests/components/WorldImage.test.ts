import { describe, expect, it } from 'vitest';

import { DataTexture, Vector2, Vector3 } from 'three';

import { WorldImage } from '../../src/components/WorldImage';
import { WorldImageMaterial } from '../../src/materials/WorldImageMaterial';

function texture_of_size(width: number, height: number): DataTexture
{
  return new DataTexture(new Uint8Array(width * height * 4), width, height);
}

describe('WorldImage', () =>
{
  it('draws its texture with a WorldImageMaterial', () =>
  {
    const texture = texture_of_size(4, 2);
    const image = new WorldImage(texture, new Vector2());

    expect(image.material).toBeInstanceOf(WorldImageMaterial);
    expect(image.material.uniforms._MainTex.value).toBe(texture);
  });

  it('is one unit tall and as wide as the texture aspect ratio', () =>
  {
    const image = new WorldImage(texture_of_size(4, 2), new Vector2());

    expect(image.size).toEqual(new Vector3(2, 1, 0));
  });

  it('opacity and screen_aligned read and write their uniforms', () =>
  {
    const image = new WorldImage(texture_of_size(4, 2), new Vector2());

    image.opacity = 0.25;
    image.screen_aligned = true;

    expect(image.material.uniforms._Opacity.value).toBe(0.25);
    expect(image.material.uniforms._ScreenAligned.value).toBe(1);
    expect(image.opacity).toBe(0.25);
    expect(image.screen_aligned).toBe(true);

    image.screen_aligned = false;

    expect(image.material.uniforms._ScreenAligned.value).toBe(0);
  });

  it('size sets the mesh scale and the screen aligned scale to a copy of the value', () =>
  {
    const image = new WorldImage(texture_of_size(4, 2), new Vector2());
    const size = new Vector3(3, 3, 3);

    image.size = size;
    size.set(9, 9, 9);

    expect(image.scale).toEqual(new Vector3(3, 3, 3));
    expect(image.material.uniforms._Scale.value).toEqual(new Vector3(3, 3, 3));
  });

  it('update_texture follows the new aspect ratio of the image', () =>
  {
    const texture = texture_of_size(4, 2);
    const image = new WorldImage(texture, new Vector2());

    texture.image = { data: new Uint8Array(2 * 4 * 4), width: 2, height: 4 };
    image.update_texture();

    expect(image.size.x).toBeCloseTo(0.5);
    expect(image.size.y).toBeCloseTo(1);
  });

  it('update_texture frees the GPU texture only when the image changed size', () =>
  {
    const texture = texture_of_size(4, 2);
    const image = new WorldImage(texture, new Vector2());
    let disposals = 0;
    texture.addEventListener('dispose', () => disposals++);

    image.update_texture();

    expect(disposals).toBe(0);

    texture.image = { data: new Uint8Array(8 * 2 * 4), width: 8, height: 2 };
    image.update_texture();

    expect(disposals).toBe(1);
  });

  it('update_texture adopts a swapped in texture without freeing it', () =>
  {
    const image = new WorldImage(texture_of_size(4, 2), new Vector2());
    const other = texture_of_size(2, 4);
    let disposals = 0;
    other.addEventListener('dispose', () => disposals++);

    image.material.uniforms._MainTex.value = other;
    image.update_texture();

    expect(disposals).toBe(0);
    expect(image.size.x).toBeCloseTo(0.5);

    other.image = { data: new Uint8Array(8 * 2 * 4), width: 8, height: 2 };
    image.update_texture();

    expect(disposals).toBe(1);
  });
});
