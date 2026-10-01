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

// A floor rising away from the camera and filling the view, so depth changes quickly
// across the screen and the packed depth buffer steps its high byte many times over
// it. Its vanishing line stays above the view: right below one, depth grows so fast
// per pixel that the packing's own precision nears the bias.
function rising_floor(): AbstractScene
{
  const scene = new AbstractScene({ name: 'normal_ao_floor_test', compilators: {} });
  const floor = new Mesh(new PlaneGeometry(200, 200), new MeshBasicNodeMaterial({ color: 0xffffff }));

  floor.rotation.x = -Math.PI / 2 + 0.6;
  floor.position.y = -2;
  scene.add(floor);

  return scene;
}

// Reruns the occlusion pass alone, without the blur, and returns its strongest value
// on pixels at least `margin` pixels away from the background, where all it can
// measure is what the surface did to itself.
async function raw_occlusion_inside_surfaces(render_mode: NormalAORender, margin: number): Promise<{ max: number, at: string[] }>
{
  render_mode.ssao_mat.set_projection_matrix(CameraManager.current.projectionMatrix);
  Graphics.blit(Graphics.depth_normals_RT, render_mode.SSAO_RT, render_mode.ssao_mat);

  const occlusion = await Graphics.readback_RT(render_mode.SSAO_RT) as Uint8Array;
  const depth_normals = await Graphics.readback_RT(Graphics.depth_normals_RT) as Uint8Array;
  const is_background = (x: number, y: number) =>
  {
    const i = (y * SIZE + x) * 4;
    return depth_normals[i] === 0 && depth_normals[i + 1] === 0;
  };

  let max = 0;
  const at: string[] = [];

  for (let y = margin; y < SIZE - margin; y++)
  {
    for (let x = margin; x < SIZE - margin; x++)
    {
      let near_background = false;

      for (let dy = -margin; dy <= margin && !near_background; dy++)
      {
        for (let dx = -margin; dx <= margin && !near_background; dx++)
        {
          near_background = is_background(x + dx, y + dy);
        }
      }

      const value = occlusion[(y * SIZE + x) * 4];

      if (!near_background && value > 0)
      {
        max = Math.max(max, value);
        at.push(`(${x}, ${y}) = ${value}`);
      }
    }
  }

  return { max, at };
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

    function enter(use_ssaa = false, use_exact_depth = true): NormalAORender
    {
      const render_mode = new NormalAORender(use_ssaa, use_exact_depth);
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

    // Interpolating packed depth with the texture filter loses precision wherever its
    // high byte steps, which self occludes flat surfaces in lines. A far plane of 500
    // makes that error several times the bias, while the packing itself still
    // resolves depth well under it.
    async function occlusion_on_rising_floor(use_exact_depth: boolean)
    {
      const camera = new PerspectiveCamera(60, 1, 0.1, 500);
      camera.position.z = CAMERA_DISTANCE;
      CameraManager.current = camera;
      SceneManager.current = rising_floor();

      const render_mode = enter(false, use_exact_depth);
      render_mode.ssao_mat.uniforms._Radius.value = 0.3;
      render_frames();

      // The margin skips the screen border, where samples fall outside the depth buffer.
      return raw_occlusion_inside_surfaces(render_mode, 3);
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

    it('reads depth exactly by default, so a flat surface seen at an angle does not band', async() =>
    {
      const { max, at } = await occlusion_on_rising_floor(true);

      expect(new NormalAORender().ssao_mat.use_exact_depth).toBe(true);
      expect(max, `occluded pixels in readback order: ${at.slice(0, 16).join(', ')}`).toBe(0);
    });

    it('trades exact depth reads for one filtered fetch when use_exact_depth is off, which bands', async() =>
    {
      const { max } = await occlusion_on_rising_floor(false);

      expect(max).toBeGreaterThan(0);
    });

    it('still renders and shades creases with filtered depth reads', () =>
    {
      const render_mode = enter(false, false);
      const pixels = render_frames();

      expect(render_mode.ssao_mat.use_exact_depth).toBe(false);
      expect(harness.reported_errors).toEqual([]);
      expect(darkest(pixels, AROUND_BOX).luminance).toBeLessThan(pixels.luminance(OPEN_WALL) - MIN_DARKENING);
      expect(darkest(pixels, MIRRORED_REGION).luminance).toBeGreaterThan(250);
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
