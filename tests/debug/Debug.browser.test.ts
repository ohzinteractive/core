import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Box3, Sphere as MathSphere, Vector3 } from 'three';

import { CameraManager } from '../../src/CameraManager';
import { Debug } from '../../src/Debug';
import { Graphics } from '../../src/Graphics';
import { SceneManager } from '../../src/SceneManager';
import { AbstractScene } from '../../src/scenes/AbstractScene';
import { BACKENDS, create_harness, type Harness, type Pixels, type Rgb, SIZE } from '../helpers/webgpu_harness';

// Pixel coordinates are counted from the top left corner of the 64x64 canvas.
const CANVAS_CENTER = { x: SIZE / 2, y: SIZE / 2 };
const CORNER = { x: 2, y: 2 };

// 20% of the color over white, blended in linear space before the sRGB output
// conversion: 0.2 * 0 + 0.8 * 1 = 0.8 linear, which is 231 in sRGB.
const LIGHT_BLUE = { r: 231, g: 231, b: 255 };
const LIGHT_RED = { r: 255, g: 231, b: 231 };
const WHITE = { r: 255, g: 255, b: 255 };
const TOLERANCE = 4;

function expect_color(actual: Rgb, expected: Rgb)
{
  expect(Math.abs(actual.r - expected.r), `red ${actual.r} vs ${expected.r}`).toBeLessThanOrEqual(TOLERANCE);
  expect(Math.abs(actual.g - expected.g), `green ${actual.g} vs ${expected.g}`).toBeLessThanOrEqual(TOLERANCE);
  expect(Math.abs(actual.b - expected.b), `blue ${actual.b} vs ${expected.b}`).toBeLessThanOrEqual(TOLERANCE);
}

for (const backend of BACKENDS)
{
  describe(`Debug on WebGPURenderer (${backend.name} backend)`, () =>
  {
    let harness: Harness;

    beforeEach(async() =>
    {
      harness = await create_harness(backend);
      SceneManager.current = new AbstractScene({ name: 'debug_test', compilators: {} });
      Debug.init();
    });

    afterEach(() =>
    {
      harness.dispose();
    });

    // One frame as RenderLoop draws it: the main scene, then the debug layer on top.
    function render_frame(background: number): Pixels
    {
      CameraManager.current.clear_color.set(background);
      Graphics.clear(undefined, CameraManager.current, true, false);
      Graphics.render(SceneManager.current, CameraManager.current);
      Debug.render(Graphics);

      return harness.read_canvas();
    }

    it(`runs on the ${backend.name} backend`, () =>
    {
      expect(harness.uses_backend()).toBe(true);
    });

    it('draws every helper and renders the debug layer without reporting errors', () =>
    {
      const origin = new Vector3();
      Debug.ctx = document.createElement('canvas').getContext('2d');

      Debug.draw_arrow(origin, new Vector3(0, 10, 0));
      Debug.draw_axis();
      Debug.draw_rectangle(origin, 10, 10, 'red');
      Debug.draw_line_2D(origin, new Vector3(10, 10, 0), 'red');
      Debug.draw_line([origin, new Vector3(10, 0, 0)]);
      Debug.draw_cube(origin, 4);
      Debug.draw_oriented_cube(origin, new Vector3(10, 10, 0));
      Debug.draw_plane(8, 8);
      Debug.draw_empty_cube(origin, 4, 0xffff00);
      Debug.draw_sphere(origin, 4, 0x00ffff);
      Debug.draw_point_array([origin, new Vector3(10, 0, 0), new Vector3(10, 10, 0)]);
      Debug.draw_sphere_helper(new MathSphere(origin, 4), 0xff00ff);
      Debug.draw_math_sphere(new MathSphere(origin, 6));
      Debug.draw_bounding_box(new Box3(new Vector3(-4, -4, -4), new Vector3(4, 4, 4)));
      Debug.draw_curve([origin, new Vector3(0, 10, 0)], { offset: 1 });

      render_frame(0xffffff);

      expect(harness.reported_errors).toEqual([]);
    });

    it('blends draw_plane over the background instead of covering it', () =>
    {
      Debug.draw_plane(16, 16, 0x0000ff);

      const pixels = render_frame(0xffffff);

      expect_color(pixels.rgb(CANVAS_CENTER), LIGHT_BLUE);
      expect_color(pixels.rgb(CORNER), WHITE);
    });

    it('blends draw_math_sphere over the background instead of covering it', () =>
    {
      Debug.draw_math_sphere(new MathSphere(new Vector3(), 8));

      const pixels = render_frame(0xffffff);

      expect_color(pixels.rgb(CANVAS_CENTER), LIGHT_RED);
      expect_color(pixels.rgb(CORNER), WHITE);
    });
  });
}
