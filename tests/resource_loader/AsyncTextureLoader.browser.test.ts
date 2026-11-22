import { beforeAll, describe, expect, it, vi } from 'vitest';

import type { Texture } from 'three';

import { ResourceContainer } from '../../src/loaders/assets_loader/ResourceContainer';
import { AsyncTextureLoader } from '../../src/resource_loader/AsyncTextureLoader';

let image_url: string;

function make_png_url(): string
{
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 2;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(0, 0, 4, 1);
  ctx.fillStyle = '#0000ff';
  ctx.fillRect(0, 1, 4, 1);

  return canvas.toDataURL('image/png');
}

async function load(method: 'load_with_old_method' | 'load_with_new_method', flipY = true): Promise<Texture>
{
  const container = new ResourceContainer('test');
  // A unique url per load so ResourceContainer's per url cache never short-circuits.
  const url = `${image_url}#${method}-${flipY}-${Math.random()}`;
  const loader = new AsyncTextureLoader('tex', url, 1, flipY);

  loader[method](container);
  await vi.waitFor(() => expect(loader.has_finished).toBe(true), { timeout: 5000 });

  return container.get('tex') as Texture;
}

describe('AsyncTextureLoader', () =>
{
  beforeAll(() =>
  {
    image_url = make_png_url();
  });

  describe('choosing the decode path (uses_image_element)', () =>
  {
    const has_bitmaps = true;

    // Safari's WebGPU copyExternalImageToTexture writes garbage for HTMLImageElement
    // sources, and Safari 17+ decodes createImageBitmap options correctly (same
    // threshold three.js' GLTFLoader uses), so modern Safari takes the ImageBitmap path.
    it('uses ImageBitmaps on Safari 17 and later', () =>
    {
      expect(AsyncTextureLoader.uses_image_element({ is_safari: true, version: 17 }, has_bitmaps)).toBe(false);
      expect(AsyncTextureLoader.uses_image_element({ is_safari: true, version: 26 }, has_bitmaps)).toBe(false);
    });

    it('keeps HTMLImageElements on Safari before 17', () =>
    {
      expect(AsyncTextureLoader.uses_image_element({ is_safari: true, version: 16.6 }, has_bitmaps)).toBe(true);
      expect(AsyncTextureLoader.uses_image_element({ is_safari: true, version: 15 }, has_bitmaps)).toBe(true);
    });

    it('keeps HTMLImageElements on Safari when the version cannot be read', () =>
    {
      expect(AsyncTextureLoader.uses_image_element({ is_safari: true, version: NaN }, has_bitmaps)).toBe(true);
    });

    it('uses ImageBitmaps on other browsers', () =>
    {
      expect(AsyncTextureLoader.uses_image_element({ is_safari: false, version: 140 }, has_bitmaps)).toBe(false);
    });

    it('keeps HTMLImageElements when createImageBitmap does not exist', () =>
    {
      expect(AsyncTextureLoader.uses_image_element({ is_safari: false, version: 140 }, false)).toBe(true);
    });
  });

  describe('legacy path (load_with_old_method)', () =>
  {
    it('hands three.js the HTMLImageElement and leaves flipping to the renderer', async() =>
    {
      const texture = await load('load_with_old_method');

      expect(texture.image).toBeInstanceOf(HTMLImageElement);
      expect(texture.flipY).toBe(true);
      expect(texture.userData.pre_flipped).not.toBe(true);
    });
  });

  describe('default path (load_with_new_method)', () =>
  {
    it('marks bitmaps decoded with imageOrientation flipY as pre-flipped', async() =>
    {
      const texture = await load('load_with_new_method', true);

      expect(texture.image).toBeInstanceOf(ImageBitmap);
      expect(texture.userData.pre_flipped).toBe(true);
    });

    it('does not mark bitmaps as pre-flipped when flipY is off', async() =>
    {
      const texture = await load('load_with_new_method', false);

      expect(texture.userData.pre_flipped).not.toBe(true);
    });
  });
});
