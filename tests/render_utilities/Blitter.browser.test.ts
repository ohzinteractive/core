import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { CanvasTexture, Mesh, PlaneGeometry, RenderTarget } from 'three';
import { MeshBasicNodeMaterial } from 'three/webgpu';

import { CameraManager } from '../../src/CameraManager';
import { Graphics } from '../../src/Graphics';
import { AbstractScene } from '../../src/scenes/AbstractScene';
import { BACKENDS, create_harness, type Harness, SIZE } from '../helpers/webgpu_harness';

const TOP_PROBE = { x: 32, y: 8 };
const BOTTOM_PROBE = { x: 32, y: 56 };

// A plain (non render target) texture whose top half is white and bottom half is black.
function top_white_texture(): CanvasTexture
{
  const source = document.createElement('canvas');
  source.width = SIZE;
  source.height = SIZE;

  const context = source.getContext('2d');
  context.fillStyle = '#000000';
  context.fillRect(0, 0, SIZE, SIZE);
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, SIZE, SIZE / 2);

  return new CanvasTexture(source);
}

// A render target holding a scene whose top half is white and bottom half is black.
function top_white_render_target(): RenderTarget
{
  const scene = new AbstractScene({ name: 'blit_test', compilators: {} });
  const top_half = new Mesh(new PlaneGeometry(SIZE, SIZE / 2), new MeshBasicNodeMaterial({ color: 0xffffff }));
  top_half.position.y = SIZE / 4;
  scene.add(top_half);

  const render_target = new RenderTarget(SIZE, SIZE);
  Graphics.clear(render_target, CameraManager.current, true, false);
  Graphics.render(scene, CameraManager.current, render_target);

  return render_target;
}

for (const backend of BACKENDS)
{
  describe(`Blitter on WebGPURenderer (${backend.name} backend)`, () =>
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

    it('copies a render target to the screen upright', () =>
    {
      Graphics.blit(top_white_render_target(), undefined);
      const pixels = harness.read_canvas();

      expect(pixels.luminance(TOP_PROBE)).toBeGreaterThan(200);
      expect(pixels.luminance(BOTTOM_PROBE)).toBeLessThan(5);
      expect(harness.reported_errors).toEqual([]);
    });

    it('copies a plain texture to the screen upright', () =>
    {
      Graphics.blit(top_white_texture(), undefined);
      const pixels = harness.read_canvas();

      expect(pixels.luminance(TOP_PROBE)).toBeGreaterThan(200);
      expect(pixels.luminance(BOTTOM_PROBE)).toBeLessThan(5);
      expect(harness.reported_errors).toEqual([]);
    });
  });
}
