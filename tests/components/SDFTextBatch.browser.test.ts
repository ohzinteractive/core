import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Color, DataTexture, Fog, Vector3 } from 'three';

import { CameraManager } from '../../src/CameraManager';
import { SDFTextBatch } from '../../src/components/sdf_text/SDFTextBatch';
import { Graphics } from '../../src/Graphics';
import { AbstractScene } from '../../src/scenes/AbstractScene';
import { BACKENDS, create_harness, type Harness, type Pixels, type Rgb, SIZE } from '../helpers/webgpu_harness';

// Pixel coordinates are counted from the top left corner of the 64x64 canvas. The
// harness camera maps world (x, y) to pixel (32 + x, 32 - y), so pixel row r is
// centered on world y = 31.5 - r, and pixel column c on world x = c - 31.5.

const WHITE = { r: 255, g: 255, b: 255 };
const BLACK = { r: 0, g: 0, b: 0 };
const MID_COLOR = { r: 64, g: 128, b: 192 };  // 0x4080c0, far from 0 and 1 so a color space shift shows
// Half of white over black, blended in linear space before the sRGB output
// conversion: 0.5 linear is 188 in sRGB.
const HALF_WHITE = { r: 188, g: 188, b: 188 };
const TOLERANCE = 4;

// A 16x16 distance atlas split in four 8x8 cells. Atlas bounds count pixels from the
// bottom left, like DataTexture rows. The glyph edge is where the median of R, G and B
// crosses 0.5.
//   'A', top left cell: a block that is fully inside (1.0) on cell columns 2..5 and
//        cell rows 4..6 (counted from the bottom), fully outside (0.0) elsewhere.
//   'B', bottom right cell: a ramp from 1/16 on its left column to 15/16 on its right
//        one, so the edge moves with the cutoff.
//   'C', top right cell: three column bands whose channels disagree. Only their median
//        tells inside from outside: no single channel, average, minimum or maximum does.
//   The bottom left cell is outside everywhere.
const ATLAS_SIZE = 16;
const CELL = 8;

const OUTSIDE = [0, 0, 0];
const INSIDE = [1, 1, 1];

function atlas_texel(column: number, row: number): number[]
{
  const cell_column = column % CELL;
  const cell_row = row % CELL;

  if (column < CELL && row >= CELL)
  {
    const inside = cell_column >= 2 && cell_column <= 5 && cell_row >= 4 && cell_row <= 6;

    return inside ? INSIDE : OUTSIDE;
  }

  if (column >= CELL && row < CELL)
  {
    const value = (cell_column + 0.5) / CELL;

    return [value, value, value];
  }

  if (column >= CELL && row >= CELL)
  {
    if (cell_column <= 1)
    {
      return [0, 0, 1];      // median 0: outside
    }

    return cell_column <= 4
      ? [0, 0.6, 0.6]        // median 0.6: inside
      : [0.6, 0, 0.6];       // median 0.6: inside
  }

  return OUTSIDE;
}

function atlas_texture(): DataTexture
{
  const data = new Uint8Array(ATLAS_SIZE * ATLAS_SIZE * 4);

  for (let row = 0; row < ATLAS_SIZE; row++)
  {
    for (let column = 0; column < ATLAS_SIZE; column++)
    {
      const [r, g, b] = atlas_texel(column, row).map(value => Math.round(value * 255));

      data.set([r, g, b, 255], (row * ATLAS_SIZE + column) * 4);
    }
  }

  const texture = new DataTexture(data, ATLAS_SIZE, ATLAS_SIZE);
  texture.needsUpdate = true;

  return texture;
}

// Every glyph fills a 1x1 em box, so a text of size 16 draws a 16x16 pixel quad, two
// pixels per atlas texel.
const FONT_LAYOUT = {
  atlas: { width: ATLAS_SIZE, height: ATLAS_SIZE },
  glyphs: [
    { unicode: 65, advance: 1, planeBounds: { left: 0, bottom: 0, right: 1, top: 1 }, atlasBounds: { left: 0, bottom: 8, right: 8, top: 16 } },
    { unicode: 66, advance: 1, planeBounds: { left: 0, bottom: 0, right: 1, top: 1 }, atlasBounds: { left: 8, bottom: 0, right: 16, top: 8 } },
    { unicode: 67, advance: 1, planeBounds: { left: 0, bottom: 0, right: 1, top: 1 }, atlasBounds: { left: 8, bottom: 8, right: 16, top: 16 } }
  ]
};

// 'A' at the origin covers world x -4..4 and y 0..6: these columns and rows.
const A_COLUMNS = [28, 29, 30, 31, 32, 33, 34, 35];
const A_ROWS = [26, 27, 28, 29, 30, 31];
// 'B' at the origin with the default cutoff (0.5) covers world x 0..8.
const B_COLUMNS = [32, 33, 34, 35, 36, 37, 38, 39];

function expect_color(actual: Rgb, expected: Rgb)
{
  expect(Math.abs(actual.r - expected.r), `red ${actual.r} vs ${expected.r}`).toBeLessThanOrEqual(TOLERANCE);
  expect(Math.abs(actual.g - expected.g), `green ${actual.g} vs ${expected.g}`).toBeLessThanOrEqual(TOLERANCE);
  expect(Math.abs(actual.b - expected.b), `blue ${actual.b} vs ${expected.b}`).toBeLessThanOrEqual(TOLERANCE);
}

// The lit pixels of canvas column x, top to bottom.
function lit_rows(pixels: Pixels, x: number): number[]
{
  const rows = [];

  for (let y = 0; y < SIZE; y++)
  {
    if (pixels.luminance({ x, y }) > 32)
    {
      rows.push(y);
    }
  }

  return rows;
}

// The lit pixels of canvas row y, left to right.
function lit_columns(pixels: Pixels, y: number): number[]
{
  const columns = [];

  for (let x = 0; x < SIZE; x++)
  {
    if (pixels.luminance({ x, y }) > 32)
    {
      columns.push(x);
    }
  }

  return columns;
}

function shifted(values: number[], offset: number): number[]
{
  return values.map(value => value + offset);
}

for (const backend of BACKENDS)
{
  describe(`SDFTextBatch on WebGPURenderer (${backend.name} backend)`, () =>
  {
    let harness: Harness;
    let scene: AbstractScene;
    let batch: SDFTextBatch;

    beforeEach(async() =>
    {
      harness = await create_harness(backend);
      scene = new AbstractScene({ name: 'sdf_text_test', compilators: {} });
      batch = new SDFTextBatch(FONT_LAYOUT, atlas_texture());
      scene.add(batch);
    });

    afterEach(() =>
    {
      batch.dispose();
      harness.dispose();
    });

    // A white text of size 16, centered at world (x, y).
    function add_text(text: string, x = 0, y = 0)
    {
      const element = batch.add_text(text);
      element.set_size(16);
      element.set_position(new Vector3(x, y, 0));

      return element;
    }

    function render_frame(): Pixels
    {
      batch.update(false);
      CameraManager.current.clear_color.set(0x000000);
      Graphics.clear(undefined, CameraManager.current, true, false);
      Graphics.render(scene, CameraManager.current);

      return harness.read_canvas();
    }

    it(`runs on the ${backend.name} backend`, () =>
    {
      expect(harness.uses_backend()).toBe(true);
    });

    it('covers the glyph fully inside its edge and nothing outside it', () =>
    {
      add_text('A');

      const pixels = render_frame();

      expect(lit_columns(pixels, 28)).toEqual(A_COLUMNS);
      expect(lit_rows(pixels, 31)).toEqual(A_ROWS);
      expect_color(pixels.rgb({ x: 31, y: 28 }), WHITE);
      expect(harness.reported_errors).toEqual([]);
    });

    it('samples the right atlas cell, upright', () =>
    {
      // 'A' sits in the top half of the atlas, and its block in the top half of its cell.
      // Read upside down, the quad would show the empty bottom left cell, or the block
      // mirrored below the text center (rows 32..37).
      add_text('A');

      const pixels = render_frame();

      expect(lit_rows(pixels, 31)).toEqual(A_ROWS);
      expect(lit_rows(pixels, 31).filter(row => row >= 32)).toEqual([]);
    });

    it('reads the distance as the median of the three channels', () =>
    {
      // 'C' at the origin: the outside band covers columns 24..27, the two inside bands
      // 28..33 and 34..39. The probes sit in the middle of each band.
      add_text('C');

      const pixels = render_frame();

      expect_color(pixels.rgb({ x: 26, y: 31 }), BLACK);
      expect_color(pixels.rgb({ x: 30, y: 31 }), WHITE);
      expect_color(pixels.rgb({ x: 37, y: 31 }), WHITE);
    });

    it('renders its color, as authored', () =>
    {
      add_text('A').set_color(new Color(0x4080c0));

      expect_color(render_frame().rgb({ x: 31, y: 28 }), MID_COLOR);
    });

    it('scales its alpha by the text opacity', () =>
    {
      add_text('A').opacity = 0.5;

      expect_color(render_frame().rgb({ x: 31, y: 28 }), HALF_WHITE);
    });

    it('places every text of the batch with its own transform', () =>
    {
      add_text('A', -16, 0);
      add_text('A', 16, -20);

      const pixels = render_frame();

      expect(lit_columns(pixels, 28)).toEqual(shifted(A_COLUMNS, -16));
      expect(lit_columns(pixels, 48)).toEqual(shifted(A_COLUMNS, 16));
      expect(lit_rows(pixels, 47)).toEqual(shifted(A_ROWS, 20));
    });

    it('covers more of the glyph with more boldness', () =>
    {
      add_text('B');

      expect(lit_columns(render_frame(), 32)).toEqual(B_COLUMNS);

      batch.set_boldness(1);

      expect(lit_columns(render_frame(), 32)).toEqual(Array.from({ length: 13 }, (_, i) => 27 + i));
    });

    it('shows its back side mirrored when turned around', () =>
    {
      add_text('B').set_rotation(180);

      expect(lit_columns(render_frame(), 32)).toEqual(shifted(B_COLUMNS, -8));
    });

    it('ignores the batch mesh transform, like the GLSL material did', () =>
    {
      add_text('A');
      batch.position.x = 10;

      expect(lit_columns(render_frame(), 28)).toEqual(A_COLUMNS);
    });

    it('shows a new text after update, and drops a removed one', () =>
    {
      const element = add_text('A');
      render_frame();

      element.text = 'B';

      expect(lit_columns(render_frame(), 32)).toEqual(B_COLUMNS);

      batch.remove_text(element);

      expect(lit_columns(render_frame(), 32)).toEqual([]);
      expect(harness.reported_errors).toEqual([]);
    });

    it('ignores scene fog, like the GLSL material did', () =>
    {
      // Red fog that is opaque past 1 unit. The text is 10 units from the camera.
      scene.fog = new Fog(0xff0000, 0.1, 1);
      add_text('A').set_color(new Color(0x4080c0));

      expect_color(render_frame().rgb({ x: 31, y: 28 }), MID_COLOR);
      expect(harness.reported_errors).toEqual([]);
    });
  });
}
