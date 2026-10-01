import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Mesh, PlaneGeometry } from 'three';
import { MeshBasicNodeMaterial } from 'three/webgpu';

import { CameraManager } from '../../src/CameraManager';
import { Graphics } from '../../src/Graphics';
import { SceneManager } from '../../src/SceneManager';
import { AbstractScene } from '../../src/scenes/AbstractScene';
import { BACKENDS, create_harness, type Harness, SIZE } from '../helpers/webgpu_harness';

// The harness camera sits at z = 10, so a quad at the origin is 10 units deep.
const QUAD_DEPTH = 10;
const DEPTH_TOLERANCE = 1 / 255;
const NORMAL_TOLERANCE = 0.03;

type Vec3 = { x: number, y: number, z: number };
type DepthNormal = { depth: number, normal: Vec3 };

// JS mirror of the decoding the deferred light shader does, so the test reads the
// G-buffer the same way its consumers do.
function decode(pixels: ArrayLike<number>, x: number, y: number): DepthNormal
{
  const i = (y * SIZE + x) * 4;
  const [r, g, b, a] = [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]].map(v => v / 255);

  const scale = 1.7777;
  const nn = { x: b * 2 * scale - scale, y: a * 2 * scale - scale, z: 1 };
  const k = 2 / (nn.x * nn.x + nn.y * nn.y + nn.z * nn.z);

  return {
    depth: r + g / 255,
    normal: { x: nn.x * k, y: nn.y * k, z: k - 1 }
  };
}

function expect_normal(actual: Vec3, expected: Vec3)
{
  expect(Math.abs(actual.x - expected.x), `x ${actual.x} vs ${expected.x}`).toBeLessThanOrEqual(NORMAL_TOLERANCE);
  expect(Math.abs(actual.y - expected.y), `y ${actual.y} vs ${expected.y}`).toBeLessThanOrEqual(NORMAL_TOLERANCE);
  expect(Math.abs(actual.z - expected.z), `z ${actual.z} vs ${expected.z}`).toBeLessThanOrEqual(NORMAL_TOLERANCE);
}

function centered_quad(): Mesh
{
  // The material is irrelevant: the depth and normals pass overrides it.
  return new Mesh(new PlaneGeometry(16, 16), new MeshBasicNodeMaterial({ color: 0xff0000 }));
}

for (const backend of BACKENDS)
{
  describe(`DepthAndNormalsRenderer on WebGPURenderer (${backend.name} backend)`, () =>
  {
    let harness: Harness;
    let quad: Mesh;

    beforeEach(async() =>
    {
      harness = await create_harness(backend);

      quad = centered_quad();

      const scene = new AbstractScene({ name: 'depth_normals_test', compilators: {} });
      scene.add(quad);
      SceneManager.current = scene;
    });

    afterEach(() =>
    {
      harness.dispose();
    });

    async function render_depth_normals(): Promise<ArrayLike<number>>
    {
      Graphics.depth_and_normals_renderer.render(Graphics);

      return Graphics.readback_RT(Graphics.depth_normals_RT);
    }

    it(`runs on the ${backend.name} backend`, () =>
    {
      expect(harness.uses_backend()).toBe(true);
    });

    it('renders without reporting incompatible materials or errors', async() =>
    {
      await render_depth_normals();

      expect(harness.reported_errors).toEqual([]);
    });

    it('encodes linear depth over the far plane and the view space normal of a surface', async() =>
    {
      const center = decode(await render_depth_normals(), SIZE / 2, SIZE / 2);

      expect(Math.abs(center.depth - QUAD_DEPTH / CameraManager.current.far)).toBeLessThanOrEqual(DEPTH_TOLERANCE);
      expect_normal(center.normal, { x: 0, y: 0, z: 1 });
    });

    it('normalizes depth with the far plane of the current camera', async() =>
    {
      CameraManager.current.far = 50;
      CameraManager.current.updateProjectionMatrix();

      const center = decode(await render_depth_normals(), SIZE / 2, SIZE / 2);

      expect(Math.abs(center.depth - QUAD_DEPTH / 50)).toBeLessThanOrEqual(DEPTH_TOLERANCE);
    });

    it('encodes tilted normals', async() =>
    {
      quad.rotation.y = Math.PI / 4;

      const center = decode(await render_depth_normals(), SIZE / 2, SIZE / 2);

      expect_normal(center.normal, { x: Math.SQRT1_2, y: 0, z: Math.SQRT1_2 });
    });

    it('fills empty pixels with the clear normal facing the camera', async() =>
    {
      const corner = decode(await render_depth_normals(), 2, 2);

      expect_normal(corner.normal, { x: 0, y: 0, z: 1 });
    });

    it('restores the scene materials after the pass', async() =>
    {
      await render_depth_normals();

      expect(SceneManager.current.overrideMaterial).toBeNull();
    });
  });
}
