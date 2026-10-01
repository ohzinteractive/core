import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Fog, Vector3 } from 'three';

import { CameraManager } from '../../src/CameraManager';
import { Line } from '../../src/components/Line';
import { Graphics } from '../../src/Graphics';
import { AbstractScene } from '../../src/scenes/AbstractScene';
import { BACKENDS, create_harness, type Harness, type Pixels, type Rgb, SIZE } from '../helpers/webgpu_harness';

// Pixel coordinates are counted from the top left corner of the 64x64 canvas. The
// harness camera maps world (x, y) to pixel (32 + x, 32 - y), so pixel row r is
// centered on world y = 31.5 - r, and pixel column c on world x = c - 31.5.

const MID_COLOR = { r: 64, g: 128, b: 192 };  // 0x4080c0, far from 0 and 1 so a color space shift shows
// A white ribbon 6 pixels thick, probed at row centers 0.5 and 2.5 pixels from its
// middle. Brightness is 11/12 and 7/12 in linear space, before the sRGB output conversion.
const NEAR_MIDDLE = { r: 245, g: 245, b: 245 };
const NEAR_EDGE = { r: 201, g: 201, b: 201 };
const TOLERANCE = 4;

// The rows a horizontal ribbon of thickness 6 through world y = 0 covers.
const ROWS_AT_Y0 = [29, 30, 31, 32, 33, 34];

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

// A white line from world x -20 to 20 at height y, through a middle point, 6 thick.
function horizontal_line(y: number): Line
{
  const line = new Line([new Vector3(-20, y, 0), new Vector3(0, y, 0), new Vector3(20, y, 0)]);
  line.thickness = 6;
  line.color = 0xffffff;

  return line;
}

for (const backend of BACKENDS)
{
  describe(`Line on WebGPURenderer (${backend.name} backend)`, () =>
  {
    let harness: Harness;
    let scene: AbstractScene;

    beforeEach(async() =>
    {
      harness = await create_harness(backend);
      scene = new AbstractScene({ name: 'line_test', compilators: {} });
    });

    afterEach(() =>
    {
      harness.dispose();
    });

    function render_frame(): Pixels
    {
      CameraManager.current.clear_color.set(0x000000);
      Graphics.clear(undefined, CameraManager.current, true, false);
      Graphics.render(scene, CameraManager.current);

      return harness.read_canvas();
    }

    it(`runs on the ${backend.name} backend`, () =>
    {
      expect(harness.uses_backend()).toBe(true);
    });

    it('covers as many rows as its thickness, centered on the line', () =>
    {
      scene.add(horizontal_line(0));

      const pixels = render_frame();

      expect(lit_rows(pixels, 12)).toEqual(ROWS_AT_Y0);
      expect(lit_rows(pixels, 32)).toEqual(ROWS_AT_Y0);
      expect(lit_columns(pixels, 32)).toEqual(Array.from({ length: 40 }, (_, i) => 12 + i));
      expect(harness.reported_errors).toEqual([]);
    });

    it('is brightest along its middle and darker toward its edges', () =>
    {
      scene.add(horizontal_line(0));

      const pixels = render_frame();

      expect_color(pixels.rgb({ x: 32, y: 31 }), NEAR_MIDDLE);
      expect_color(pixels.rgb({ x: 32, y: 32 }), NEAR_MIDDLE);
      expect_color(pixels.rgb({ x: 32, y: 29 }), NEAR_EDGE);
      expect_color(pixels.rgb({ x: 32, y: 34 }), NEAR_EDGE);
    });

    it('renders its color, as authored, along its middle', () =>
    {
      // Through world y = 0.5, the middle of the ribbon runs along the centers of row 31.
      const line = horizontal_line(0.5);
      line.color = 0x4080c0;
      scene.add(line);

      expect_color(render_frame().rgb({ x: 32, y: 31 }), MID_COLOR);
    });

    it('widens when its thickness changes after it was drawn', () =>
    {
      const line = horizontal_line(0);
      scene.add(line);
      render_frame();

      line.thickness = 10;

      expect(lit_rows(render_frame(), 32)).toEqual(Array.from({ length: 10 }, (_, i) => 27 + i));
    });

    it('renders a two point line, with its thickness measured across it', () =>
    {
      const line = new Line([new Vector3(0, -20, 0), new Vector3(0, 20, 0)]);
      line.thickness = 6;
      line.color = 0xffffff;
      scene.add(line);

      const pixels = render_frame();

      expect(lit_columns(pixels, 32)).toEqual(ROWS_AT_Y0);
      expect(lit_rows(pixels, 32)).toEqual(Array.from({ length: 40 }, (_, i) => 12 + i));
    });

    it('builds on setup after the empty constructor', () =>
    {
      const line = new Line();
      line.thickness = 6;
      line.color = 0xffffff;
      line.setup([new Vector3(-20, 0, 0), new Vector3(20, 0, 0)]);
      scene.add(line);

      expect(lit_rows(render_frame(), 32)).toEqual(ROWS_AT_Y0);
    });

    it('follows the mesh position', () =>
    {
      // Moved along its own length, so the ribbon keeps its full thickness: only the
      // columns it covers change, from 12..51 to 22..61.
      const line = horizontal_line(0);
      line.position.x = 10;
      scene.add(line);

      const pixels = render_frame();

      expect(lit_columns(pixels, 32)).toEqual(Array.from({ length: 40 }, (_, i) => 22 + i));
      expect(lit_rows(pixels, 32)).toEqual(ROWS_AT_Y0);
    });

    it('turns toward the camera position, not along the camera view direction', () =>
    {
      // The harness camera is orthographic, but the ribbon faces the camera position, as
      // the GLSL material did. Ten units above the camera axis, the direction to the camera
      // is tilted, so the ribbon is about 0.7 as tall on screen: 4 rows instead of 6.
      const line = horizontal_line(0);
      line.position.y = 10;
      scene.add(line);

      expect(lit_rows(render_frame(), 32)).toEqual([20, 21, 22, 23]);
    });

    it('keeps facing the camera when the mesh turns around', () =>
    {
      const line = horizontal_line(0);
      line.rotation.y = Math.PI;
      scene.add(line);

      expect(lit_rows(render_frame(), 32)).toEqual(ROWS_AT_Y0);
    });

    it('keeps its full thickness on screen when the mesh tilts away from the camera', () =>
    {
      // Turned 90 degrees around its own length, the line stays in place, but a ribbon
      // extruded before the mesh transform would now lie edge on to the camera.
      const line = horizontal_line(0);
      line.rotation.x = Math.PI / 2;
      scene.add(line);

      expect(lit_rows(render_frame(), 32)).toEqual(ROWS_AT_Y0);
    });

    it('ignores scene fog, like the GLSL material did', () =>
    {
      // Red fog that is opaque past 1 unit. The line is 10 units from the camera.
      scene.fog = new Fog(0xff0000, 0.1, 1);
      const line = horizontal_line(0.5);
      line.color = 0x4080c0;
      scene.add(line);

      expect_color(render_frame().rgb({ x: 32, y: 31 }), MID_COLOR);
      expect(harness.reported_errors).toEqual([]);
    });

    it('shows every segment after setup changes the point count of a drawn line', () =>
    {
      const line = new Line([new Vector3(-20, 0, 0), new Vector3(0, 0, 0)]);
      line.thickness = 6;
      line.color = 0xffffff;
      scene.add(line);

      expect(lit_rows(render_frame(), 48)).toEqual([]);

      line.setup([new Vector3(-20, 0, 0), new Vector3(0, 0, 0), new Vector3(20, 0, 0)]);

      expect(lit_rows(render_frame(), 48)).toEqual(ROWS_AT_Y0);

      line.setup([new Vector3(-20, 0, 0), new Vector3(0, 0, 0)]);

      expect(lit_rows(render_frame(), 48)).toEqual([]);
      expect(harness.reported_errors).toEqual([]);
    });

    it('draws a line that was rendered empty and set up later', () =>
    {
      const line = new Line();
      line.thickness = 6;
      line.color = 0xffffff;
      scene.add(line);
      render_frame();

      line.setup([new Vector3(-20, 0, 0), new Vector3(20, 0, 0)]);

      expect(lit_rows(render_frame(), 32)).toEqual(ROWS_AT_Y0);
      expect(harness.reported_errors).toEqual([]);
    });

    it('keeps growing when setup adds points to a drawn line more than once', () =>
    {
      // Points 10 units apart from world x = -20, so each count covers its own columns.
      const points_up_to = (count: number) => Array.from({ length: count }, (_, i) => new Vector3(-20 + i * 10, 0, 0));
      const line = new Line(points_up_to(2));
      line.thickness = 6;
      line.color = 0xffffff;
      scene.add(line);

      expect(lit_columns(render_frame(), 32)).toEqual(Array.from({ length: 10 }, (_, i) => 12 + i));

      line.setup(points_up_to(3));

      expect(lit_columns(render_frame(), 32)).toEqual(Array.from({ length: 20 }, (_, i) => 12 + i));

      line.setup(points_up_to(5));

      expect(lit_columns(render_frame(), 32)).toEqual(Array.from({ length: 40 }, (_, i) => 12 + i));
      expect(harness.reported_errors).toEqual([]);
    });
  });
}
