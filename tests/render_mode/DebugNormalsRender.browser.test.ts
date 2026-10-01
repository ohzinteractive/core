import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Mesh, PlaneGeometry } from 'three';
import { MeshBasicNodeMaterial } from 'three/webgpu';

import { CameraManager } from '../../src/CameraManager';
import { Graphics } from '../../src/Graphics';
import { SceneManager } from '../../src/SceneManager';
import { DebugNormalsRender } from '../../src/render_mode/DebugNormalsRender';
import { AbstractScene } from '../../src/scenes/AbstractScene';
import { BACKENDS, create_harness, type Harness, type Pixels, type Rgb, SIZE } from '../helpers/webgpu_harness';

// Pixel coordinates are counted from the top left corner of the 64x64 canvas.
const QUAD_CENTER = { x: 16, y: 16 };
const MIRRORED_PROBE = { x: 16, y: 48 };  // where the quad would land if the image were flipped vertically
const FAR_PROBE = { x: 48, y: 48 };
const CANVAS_CENTER = { x: SIZE / 2, y: SIZE / 2 };

// normal * 0.5 + 0.5, written straight to the canvas like the GLSL version did.
const FACING_CAMERA_COLOR = { r: 128, g: 128, b: 255 };   // normal (0, 0, 1)
const TILTED_COLOR = { r: 218, g: 128, b: 218 };          // normal (0.707, 0, 0.707)
const TOLERANCE = 4;

function quad_at(x: number, y: number): Mesh
{
  // The material is irrelevant: DebugNormalsRender overrides it.
  const quad = new Mesh(new PlaneGeometry(8, 8), new MeshBasicNodeMaterial({ color: 0xff0000 }));

  quad.position.set(x - SIZE / 2, SIZE / 2 - y, 0);

  return quad;
}

function scene_with(...meshes: Mesh[]): AbstractScene
{
  const scene = new AbstractScene({ name: 'debug_normals_test', compilators: {} });

  meshes.forEach(mesh => scene.add(mesh));

  return scene;
}

function expect_color(actual: Rgb, expected: Rgb)
{
  expect(Math.abs(actual.r - expected.r), `red ${actual.r} vs ${expected.r}`).toBeLessThanOrEqual(TOLERANCE);
  expect(Math.abs(actual.g - expected.g), `green ${actual.g} vs ${expected.g}`).toBeLessThanOrEqual(TOLERANCE);
  expect(Math.abs(actual.b - expected.b), `blue ${actual.b} vs ${expected.b}`).toBeLessThanOrEqual(TOLERANCE);
}

for (const backend of BACKENDS)
{
  describe(`DebugNormalsRender on WebGPURenderer (${backend.name} backend)`, () =>
  {
    let harness: Harness;

    beforeEach(async() =>
    {
      harness = await create_harness(backend);
      SceneManager.current = scene_with(quad_at(QUAD_CENTER.x, QUAD_CENTER.y));
    });

    afterEach(() =>
    {
      harness.dispose();
    });

    function render_normals(): Pixels
    {
      const render_mode = new DebugNormalsRender();

      Graphics.set_state(render_mode);
      render_mode.render();
      render_mode.render();

      return harness.read_canvas();
    }

    it(`runs on the ${backend.name} backend`, () =>
    {
      expect(harness.uses_backend()).toBe(true);
    });

    it('renders without reporting incompatible materials or errors', () =>
    {
      render_normals();

      expect(harness.reported_errors).toEqual([]);
    });

    it('colors a surface facing the camera with its packed normal, in the right orientation', () =>
    {
      const pixels = render_normals();

      expect_color(pixels.rgb(QUAD_CENTER), FACING_CAMERA_COLOR);
      expect(pixels.luminance(MIRRORED_PROBE)).toBeLessThan(5);
      expect(pixels.luminance(FAR_PROBE)).toBeLessThan(5);
    });

    it('colors normals in world space, regardless of the camera orientation', () =>
    {
      const tilted = quad_at(CANVAS_CENTER.x, CANVAS_CENTER.y);
      tilted.rotation.y = Math.PI / 4;
      SceneManager.current = scene_with(tilted);

      expect_color(render_normals().rgb(CANVAS_CENTER), TILTED_COLOR);

      // Rolling the camera changes the view space normal but not the world space one.
      CameraManager.current.rotation.z = Math.PI / 2;
      CameraManager.current.updateMatrixWorld(true);

      expect_color(render_normals().rgb(CANVAS_CENTER), TILTED_COLOR);
    });

    it('reuses one override material across frames instead of building a new one each frame', () =>
    {
      const render_spy = vi.spyOn(Graphics, 'render');
      const render_mode = new DebugNormalsRender();

      render_mode.render();
      render_mode.render();

      const [first, second] = render_spy.mock.calls.map(call => call[3]);
      expect(first).toBeDefined();
      expect(second).toBe(first);
    });
  });
}
