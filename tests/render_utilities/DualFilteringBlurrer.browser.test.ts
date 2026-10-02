import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DataTexture, RenderTarget } from 'three';

import { Graphics } from '../../src/Graphics';
import { DualFilteringBlurMaterial } from '../../src/materials/DualFilteringBlurMaterial';
import { BACKENDS, create_harness, type Harness, SIZE } from '../helpers/webgpu_harness';

const TOP_PROBE = { x: 32, y: 8 };
const BOTTOM_PROBE = { x: 32, y: 56 };

// A size x size gray texture. value_at gets y = 0 at the top, like the canvas probes.
function gray_texture(value_at: (x: number, y: number) => number, size = SIZE): DataTexture
{
  const data = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y++)
  {
    for (let x = 0; x < size; x++)
    {
      const value = value_at(x, y);

      // DataTexture rows start at the bottom.
      data.set([value, value, value, 255], ((size - 1 - y) * size + x) * 4);
    }
  }

  const texture = new DataTexture(data, size, size);
  texture.needsUpdate = true;

  return texture;
}

const top_white = (size: number) => (x: number, y: number) => (y < size / 2 ? 255 : 0);
const lone_texel = (x: number, y: number) => (x === 32 && y === 32 ? 255 : 0);

// Copies a texture into a new render target, the input a blur pass usually gets.
function to_render_target(texture: DataTexture, size = SIZE): RenderTarget
{
  const render_target = new RenderTarget(size, size);
  Graphics.blit(texture, render_target);

  return render_target;
}

function blur_pass(source: RenderTarget | DataTexture, size: number, upsample: boolean): RenderTarget
{
  const target = new RenderTarget(size, size);
  Graphics.blit(source, target, new DualFilteringBlurMaterial(upsample));

  return target;
}

// Red channel of a SIZE x SIZE target, row by row. WebGPU returns the rows top down
// and WebGL bottom up, so compare only patterns that are symmetric top to bottom.
// Keep targets 64 texels wide: WebGPU copies rows in 256 byte steps.
async function read_red(harness: Harness, render_target: RenderTarget): Promise<number[][]>
{
  const data = await harness.renderer.readRenderTargetPixelsAsync(render_target, 0, 0, SIZE, SIZE) as Uint8Array;

  return Array.from({ length: SIZE }, (_, row) => Array.from({ length: SIZE }, (_, x) => data[(row * SIZE + x) * 4]));
}

// The 3x3 texels around the center of the lit area.
async function read_spot(harness: Harness, render_target: RenderTarget): Promise<number[][]>
{
  const rows = await read_red(harness, render_target);
  const lit_rows = rows.map((values, row) => (values.some(value => value > 0) ? row : -1)).filter(row => row >= 0);
  const lit_columns = rows[0].map((_, x) => (rows.some(values => values[x] > 0) ? x : -1)).filter(x => x >= 0);
  const row = (lit_rows[0] + lit_rows[lit_rows.length - 1]) / 2;
  const x = (lit_columns[0] + lit_columns[lit_columns.length - 1]) / 2;

  return [row - 1, row, row + 1].map(r => rows[r]?.slice(x - 1, x + 2));
}

for (const backend of BACKENDS)
{
  describe(`DualFilteringBlurMaterial on WebGPURenderer (${backend.name} backend)`, () =>
  {
    let harness: Harness;

    beforeEach(async() =>
    {
      harness = await create_harness(backend);
    });

    afterEach(() =>
    {
      harness.dispose();
    });

    it(`runs on the ${backend.name} backend`, () =>
    {
      expect(harness.uses_backend()).toBe(true);
    });

    // A 1:1 pass puts the center tap on the texel, so it reads the whole texel, and puts
    // every half texel tap on a texel corner, so it reads a quarter of each texel it touches.
    // Center: (4 * 1 + 4 * 1/4) / 8 = 5/8. Side neighbors: two quarter taps, 1/16.
    // Diagonal neighbors: one quarter tap, 1/32.
    it('downsamples a lone texel with the 5 tap kernel', async() =>
    {
      const output = blur_pass(to_render_target(gray_texture(lone_texel)), SIZE, false);

      expect(await read_spot(harness, output)).toEqual([
        [8, 16, 8],
        [16, 159, 16],
        [8, 16, 8]
      ]);
      expect(harness.reported_errors).toEqual([]);
    });

    // The four side taps land a whole texel away, on the neighbors, and the four
    // diagonal taps (weight 2) half a texel away, on corners. Center: 4 * 2 * 1/4 / 12 = 1/6.
    // Side neighbors: one side tap plus two diagonal ones, (1 + 2 * 2 * 1/4) / 12 = 1/6.
    // Diagonal neighbors: one diagonal tap, 2 * 1/4 / 12 = 1/24.
    it('upsamples a lone texel with the 8 tap tent kernel', async() =>
    {
      const output = blur_pass(to_render_target(gray_texture(lone_texel)), SIZE, true);

      expect(await read_spot(harness, output)).toEqual([
        [11, 43, 11],
        [43, 43, 43],
        [11, 43, 11]
      ]);
      expect(harness.reported_errors).toEqual([]);
    });

    for (const input of ['regular texture', 'render target'])
    {
      it(`blurs a ${input} upright in both modes`, () =>
      {
        for (const upsample of [false, true])
        {
          const texture = gray_texture(top_white(SIZE));
          const source = input === 'render target' ? to_render_target(texture) : texture;

          Graphics.blit(blur_pass(source, upsample ? SIZE : SIZE / 2, upsample), undefined);
          const pixels = harness.read_canvas();

          expect(pixels.luminance(TOP_PROBE)).toBeGreaterThan(250);
          expect(pixels.luminance(BOTTOM_PROBE)).toBeLessThan(5);
        }

        expect(harness.reported_errors).toEqual([]);
      });
    }
  });
}
