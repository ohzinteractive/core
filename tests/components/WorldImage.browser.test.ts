import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DataTexture, SRGBColorSpace, Vector2, Vector3 } from 'three';

import { CameraManager } from '../../src/CameraManager';
import { Text2D } from '../../src/components/Text2D';
import { WorldImage } from '../../src/components/WorldImage';
import { Graphics } from '../../src/Graphics';
import { AbstractScene } from '../../src/scenes/AbstractScene';
import { BACKENDS, create_harness, type Harness, type Pixels, type Rgb, SIZE } from '../helpers/webgpu_harness';

// Pixel coordinates are counted from the top left corner of the 64x64 canvas. The
// harness camera maps world (x, y) to pixel (32 + x, 32 - y).
const CANVAS_CENTER = { x: SIZE / 2, y: SIZE / 2 };

const WHITE = { r: 255, g: 255, b: 255 };
const BLACK = { r: 0, g: 0, b: 0 };
const MID_COLOR = { r: 64, g: 128, b: 192 };  // 0x4080c0, far from 0 and 1 so a color space shift shows
// Half of white over black, blended in linear space before the sRGB output
// conversion: 0.5 linear is 188 in sRGB.
const HALF_WHITE = { r: 188, g: 188, b: 188 };
const TOLERANCE = 4;

function expect_color(actual: Rgb, expected: Rgb)
{
  expect(Math.abs(actual.r - expected.r), `red ${actual.r} vs ${expected.r}`).toBeLessThanOrEqual(TOLERANCE);
  expect(Math.abs(actual.g - expected.g), `green ${actual.g} vs ${expected.g}`).toBeLessThanOrEqual(TOLERANCE);
  expect(Math.abs(actual.b - expected.b), `blue ${actual.b} vs ${expected.b}`).toBeLessThanOrEqual(TOLERANCE);
}

// An 8x8 sRGB texture with a white top left quarter and MID_COLOR elsewhere. DataTexture
// rows start at the bottom (flipY is false), so the top left quarter is the last rows'
// first columns.
function marker_texture(): DataTexture
{
  const size = 8;
  const data = new Uint8Array(size * size * 4);

  for (let row = 0; row < size; row++)
  {
    for (let column = 0; column < size; column++)
    {
      const is_marker = row >= size / 2 && column < size / 2;
      const { r, g, b } = is_marker ? WHITE : MID_COLOR;

      data.set([r, g, b, 255], (row * size + column) * 4);
    }
  }

  const texture = new DataTexture(data, size, size);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function white_texture(): DataTexture
{
  const texture = new DataTexture(new Uint8Array(4).fill(255), 1, 1);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

for (const backend of BACKENDS)
{
  describe(`WorldImage on WebGPURenderer (${backend.name} backend)`, () =>
  {
    let harness: Harness;
    let scene: AbstractScene;

    beforeEach(async() =>
    {
      harness = await create_harness(backend);
      scene = new AbstractScene({ name: 'world_image_test', compilators: {} });
    });

    afterEach(() =>
    {
      harness.dispose();
    });

    function render_frame(background: number): Pixels
    {
      CameraManager.current.clear_color.set(background);
      Graphics.clear(undefined, CameraManager.current, true, false);
      Graphics.render(scene, CameraManager.current);

      return harness.read_canvas();
    }

    it(`runs on the ${backend.name} backend`, () =>
    {
      expect(harness.uses_backend()).toBe(true);
    });

    it('renders the texture upright, on the side of the origin the pivot asks for, in its authored colors', () =>
    {
      // Pivot (-1, -1) puts the bottom left corner at the origin: the 32x32 image fills the top right quarter.
      const image = new WorldImage(marker_texture(), new Vector2(-1, -1));
      image.scale.setScalar(32);
      scene.add(image);

      const pixels = render_frame(0x000000);

      expect_color(pixels.rgb({ x: 40, y: 8 }), WHITE);       // the texture's top left quarter
      expect_color(pixels.rgb({ x: 56, y: 8 }), MID_COLOR);   // its top right quarter
      expect_color(pixels.rgb({ x: 40, y: 24 }), MID_COLOR);  // where the marker lands if flipped vertically
      expect_color(pixels.rgb({ x: 24, y: 8 }), BLACK);       // left of the pivot
      expect_color(pixels.rgb({ x: 40, y: 40 }), BLACK);      // below the pivot
      expect(harness.reported_errors).toEqual([]);
    });

    it('shows its back face, mirrored, when the mesh turns around', () =>
    {
      const image = new WorldImage(marker_texture(), new Vector2());
      image.scale.setScalar(32);
      image.rotation.y = Math.PI;
      scene.add(image);

      const pixels = render_frame(0x000000);

      expect_color(pixels.rgb({ x: 40, y: 24 }), WHITE);      // the marker, now top right
      expect_color(pixels.rgb({ x: 24, y: 24 }), MID_COLOR);
    });

    it('blends halfway with the background at opacity 0.5', () =>
    {
      const image = new WorldImage(white_texture(), new Vector2());
      image.scale.setScalar(32);
      image.opacity = 0.5;
      scene.add(image);

      const pixels = render_frame(0x000000);

      expect_color(pixels.rgb(CANVAS_CENTER), HALF_WHITE);
    });

    it('faces the camera at full width when screen aligned, however the mesh is rotated', () =>
    {
      const image = new WorldImage(marker_texture(), new Vector2());
      image.size = new Vector3(32, 32, 32);
      image.rotation.y = 80 * Math.PI / 180;
      image.updateMatrixWorld(true);
      scene.add(image);

      const edge = { x: 44, y: 32 };

      expect_color(render_frame(0x000000).rgb(edge), BLACK);

      image.screen_aligned = true;

      const pixels = render_frame(0x000000);

      expect_color(pixels.rgb(edge), MID_COLOR);
      expect_color(pixels.rgb({ x: 24, y: 24 }), WHITE);      // the marker stays top left
      expect_color(pixels.rgb({ x: 24, y: 40 }), MID_COLOR);
      expect(harness.reported_errors).toEqual([]);
    });

    it('leaves the background visible around the Text2D glyphs', () =>
    {
      const text = new Text2D('H', 'bold 48px Arial', '#000000', new Vector2());
      text.size = new Vector3(48, 48, 48);
      scene.add(text);

      // Inside the 48 pixel tall quad (rows 8 to 56), above the top of the H.
      expect_color(render_frame(0xffffff).rgb({ x: SIZE / 2, y: 12 }), WHITE);
    });
  });
}
