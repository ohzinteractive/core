import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Mesh, PlaneGeometry } from 'three';
import { MeshBasicNodeMaterial } from 'three/webgpu';

import { Graphics } from '../src/Graphics';
import { OScreen } from '../src/OScreen';
import { SceneManager } from '../src/SceneManager';
import { NormalRender } from '../src/render_mode/NormalRender';
import { AbstractScene } from '../src/scenes/AbstractScene';
import { BACKENDS, create_harness, type Harness, SIZE } from './helpers/webgpu_harness';

const entry = (width: number, height: number) =>
  ({ contentRect: { x: 0, y: 0, width, height } }) as ResizeObserverEntry;

function build_scene(): AbstractScene
{
  const scene = new AbstractScene({ name: 'resize_test', compilators: {} });
  scene.add(new Mesh(new PlaneGeometry(8, 8), new MeshBasicNodeMaterial({ color: 0xffffff })));

  return scene;
}

for (const backend of BACKENDS)
{
  describe(`Graphics.on_resize with a runtime DPR (${backend.name} backend)`, () =>
  {
    let harness: Harness;

    beforeEach(async() =>
    {
      harness = await create_harness(backend);
      SceneManager.current = build_scene();
      Graphics.set_state(new NormalRender());
    });

    afterEach(() =>
    {
      harness.dispose();
    });

    it.each([0.75, 1, 2])('sizes the canvas to floor(css x %s)', (dpr) =>
    {
      Graphics.on_resize([entry(SIZE, SIZE)], dpr);

      expect(harness.uses_backend()).toBe(true);
      expect(Graphics.canvas.width).toBe(Math.floor(SIZE * dpr));
      expect(Graphics.canvas.height).toBe(Math.floor(SIZE * dpr));
      expect(harness.renderer.getPixelRatio()).toBe(dpr);
      expect(OScreen.render_width).toBe(Graphics.canvas.width);
      expect(OScreen.render_height).toBe(Graphics.canvas.height);
    });

    it('keeps canvas and OScreen equal when css x dpr is not an integer', () =>
    {
      Graphics.on_resize([entry(101, 63)], 0.75);

      expect(Graphics.canvas.width).toBe(75);
      expect(Graphics.canvas.height).toBe(47);
      expect(OScreen.render_width).toBe(75);
      expect(OScreen.render_height).toBe(47);
    });

    it('goes back down after going up', () =>
    {
      Graphics.on_resize([entry(SIZE, SIZE)], 2);
      Graphics.on_resize([entry(SIZE, SIZE)], 0.75);

      expect(Graphics.canvas.width).toBe(48);
    });

    it('renders at the new size without errors', () =>
    {
      Graphics.on_resize([entry(SIZE, SIZE)], 2);
      Graphics.update();

      expect(harness.reported_errors).toEqual([]);
    });
  });
}
