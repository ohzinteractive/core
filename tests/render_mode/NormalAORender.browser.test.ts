import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { BoxGeometry, Mesh, PlaneGeometry } from 'three';
import { MeshBasicNodeMaterial } from 'three/webgpu';

import { CameraManager } from '../../src/CameraManager';
import { Graphics } from '../../src/Graphics';
import { PerspectiveCamera } from '../../src/PerspectiveCamera';
import { SceneManager } from '../../src/SceneManager';
import { NormalAORender } from '../../src/render_mode/NormalAORender';
import { AbstractScene } from '../../src/scenes/AbstractScene';
import { BACKENDS, create_harness, type Harness, type Pixels, type Probe, type Rgb, SIZE } from '../helpers/webgpu_harness';

// A 90 degree camera 5 units in front of a wall at z = 0. A unit box sits on the
// wall, centered on (-2.5, 2.5), so its front face covers pixels 8 to 16 on both
// axes and its sides cover up to pixel 19. Pixels are counted from the top left.
const CAMERA_DISTANCE = 5;
const BOX_CENTER = { x: -2.5, y: 2.5 };

type Region = { from: Probe, to: Probe };

// The box with the creases where it meets the wall, and where they would land
// if the image were flipped vertically.
const AROUND_BOX: Region = { from: { x: 4, y: 4 }, to: { x: 24, y: 24 } };
const MIRRORED_REGION: Region = { from: { x: 4, y: 40 }, to: { x: 24, y: 60 } };
const BOX_FRONT = { x: 12, y: 12 };       // flat face with nothing in front of it
const OPEN_WALL = { x: 48, y: 48 };

// Large enough for the box to reach the wall pixels beside it at this resolution.
const TEST_RADIUS = 1;

// The occluded band is a few pixels wide and the kernel is random, so the tests
// look at the darkest pixel of a region rather than at a fixed pixel.
// Measured on both backends: about 237 at the creases against 255 on open wall.
const MIN_DARKENING = 10;

function darkest(pixels: Pixels, { from, to }: Region): { luminance: number, rgb: Rgb }
{
  let found = { luminance: Infinity, rgb: { r: 0, g: 0, b: 0 } };

  for (let y = from.y; y <= to.y; y++)
  {
    for (let x = from.x; x <= to.x; x++)
    {
      const luminance = pixels.luminance({ x, y });

      if (luminance < found.luminance)
      {
        found = { luminance, rgb: pixels.rgb({ x, y }) };
      }
    }
  }

  return found;
}

function scene_with_box(color: number): AbstractScene
{
  const scene = new AbstractScene({ name: 'normal_ao_test', compilators: {} });
  const material = new MeshBasicNodeMaterial({ color });

  const box = new Mesh(new BoxGeometry(1, 1, 1), material);
  box.position.set(BOX_CENTER.x, BOX_CENTER.y, 0.5);

  scene.add(new Mesh(new PlaneGeometry(20, 20), material));
  scene.add(box);

  return scene;
}

for (const backend of BACKENDS)
{
  describe(`NormalAORender on WebGPURenderer (${backend.name} backend)`, () =>
  {
    let harness: Harness;

    beforeEach(async() =>
    {
      harness = await create_harness(backend);

      const camera = new PerspectiveCamera(90, 1, 0.1, 100);
      camera.position.z = CAMERA_DISTANCE;
      CameraManager.current = camera;

      SceneManager.current = scene_with_box(0xffffff);
    });

    afterEach(() =>
    {
      harness.dispose();
    });

    function enter(use_ssaa = false): NormalAORender
    {
      const render_mode = new NormalAORender(use_ssaa);
      render_mode.ssao_mat.uniforms._Radius.value = TEST_RADIUS;
      Graphics.set_state(render_mode);

      return render_mode;
    }

    function render_frames(): Pixels
    {
      Graphics.update();
      Graphics.update();

      return harness.read_canvas();
    }

    it(`runs on the ${backend.name} backend`, () =>
    {
      expect(harness.uses_backend()).toBe(true);
    });

    it('asks Graphics for the depth and normals buffer once it becomes the render mode', () =>
    {
      Graphics.generate_depth_normal_texture = false;

      enter();

      expect(Graphics.generate_depth_normal_texture).toBe(true);
    });

    it('renders without reporting incompatible materials or errors', () =>
    {
      enter();
      render_frames();

      expect(harness.reported_errors).toEqual([]);
    });

    it('leaves surfaces with nothing around them at full brightness', () =>
    {
      enter();
      const pixels = render_frames();

      expect(pixels.luminance(OPEN_WALL)).toBeGreaterThan(245);
      expect(pixels.luminance(BOX_FRONT)).toBeGreaterThan(245);
    });

    it('darkens the wall beside the box, in the right orientation', () =>
    {
      enter();
      const pixels = render_frames();

      expect(darkest(pixels, AROUND_BOX).luminance).toBeLessThan(pixels.luminance(OPEN_WALL) - MIN_DARKENING);
      expect(darkest(pixels, MIRRORED_REGION).luminance).toBeGreaterThan(250);
    });

    it('darkens by scaling the scene color, so the hue is kept', () =>
    {
      SceneManager.current = scene_with_box(0x00ff00);
      enter();
      const pixels = render_frames();

      const open = pixels.rgb(OPEN_WALL);
      const occluded = darkest(pixels, AROUND_BOX).rgb;

      expect(open.g).toBeGreaterThan(245);
      expect(occluded.g).toBeLessThan(open.g - MIN_DARKENING);
      expect(occluded.r).toBeLessThan(10);
      expect(occluded.b).toBeLessThan(10);
    });

    it('supersamples the scene at twice the resolution and still shades it', () =>
    {
      const render_mode = enter(true);
      const pixels = render_frames();

      expect(render_mode.main_RT.width).toBe(SIZE * 2);
      expect(render_mode.main_RT.height).toBe(SIZE * 2);
      expect(render_mode.SSAO_RT.width).toBe(SIZE);
      expect(harness.reported_errors).toEqual([]);
      expect(darkest(pixels, AROUND_BOX).luminance).toBeLessThan(pixels.luminance(OPEN_WALL) - MIN_DARKENING);
    });
  });
}
