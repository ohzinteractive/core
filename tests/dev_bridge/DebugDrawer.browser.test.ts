import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { BoxGeometry, Mesh } from 'three';
import { MeshBasicNodeMaterial } from 'three/webgpu';

import { CameraManager } from '../../src/CameraManager';
import { Debug } from '../../src/Debug';
import type { WorldImage } from '../../src/components/WorldImage';
import { DebugDrawer } from '../../src/dev_bridge/DebugDrawer';
import { Graphics } from '../../src/Graphics';
import { SceneManager } from '../../src/SceneManager';
import { AbstractScene } from '../../src/scenes/AbstractScene';
import { BACKENDS, create_harness, type Harness, type Pixels, type Rgb, SIZE } from '../helpers/webgpu_harness';

const CANVAS_CENTER = { x: SIZE / 2, y: SIZE / 2 };
const WHITE = { r: 255, g: 255, b: 255 };
const RED = { r: 255, g: 0, b: 0 };
const BLACK = { r: 0, g: 0, b: 0 };
const MID_COLOR = { r: 64, g: 128, b: 192 };  // #4080c0
const TOLERANCE = 4;

function expect_color(actual: Rgb, expected: Rgb)
{
  expect(Math.abs(actual.r - expected.r), `red ${actual.r} vs ${expected.r}`).toBeLessThanOrEqual(TOLERANCE);
  expect(Math.abs(actual.g - expected.g), `green ${actual.g} vs ${expected.g}`).toBeLessThanOrEqual(TOLERANCE);
  expect(Math.abs(actual.b - expected.b), `blue ${actual.b} vs ${expected.b}`).toBeLessThanOrEqual(TOLERANCE);
}

// The brightest pixel of a canvas row, a stand-in for a fully covered glyph pixel.
function brightest_in_row(pixels: Pixels, y: number): Rgb
{
  let brightest = BLACK;

  for (let x = 0; x < SIZE; x++)
  {
    if (pixels.luminance({ x, y }) > (brightest.r + brightest.g + brightest.b) / 3)
    {
      brightest = pixels.rgb({ x, y });
    }
  }

  return brightest;
}

for (const backend of BACKENDS)
{
  describe(`DebugDrawer on WebGPURenderer (${backend.name} backend)`, () =>
  {
    let harness: Harness;
    let drawer: DebugDrawer;

    beforeEach(async() =>
    {
      harness = await create_harness(backend);
      SceneManager.current = new AbstractScene({ name: 'drawer_test', compilators: {} });
      Debug.init();
      drawer = new DebugDrawer();
    });

    afterEach(() =>
    {
      harness.dispose();
    });

    function draw(request: Record<string, unknown>)
    {
      return drawer.draw(Debug, SceneManager.current, request);
    }

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

    it('draws all six shapes and renders them without reporting errors', () =>
    {
      const target = new Mesh(new BoxGeometry(4, 4, 4), new MeshBasicNodeMaterial());
      target.name = 'target';
      SceneManager.current.add(target);

      draw({ shape: 'cube', size: 4 });
      draw({ shape: 'sphere', size: 4 });
      draw({ shape: 'plane', size: 8 });
      draw({ shape: 'math_sphere', size: 6 });
      draw({ shape: 'bounding_box', object: { name: 'target' } });
      draw({ shape: 'label', text: 'target', size: 4 });

      render_frame(0xffffff);

      expect(harness.reported_errors).toEqual([]);
    });

    it('shows a cube in its own color, and the background again once cleared', () =>
    {
      draw({ shape: 'cube', size: 16 });

      expect_color(render_frame(0xffffff).rgb(CANVAS_CENTER), RED);

      drawer.clear({});

      expect_color(render_frame(0xffffff).rgb(CANVAS_CENTER), WHITE);
      expect(harness.reported_errors).toEqual([]);
    });

    it('draws a label from its text, and frees the label texture once cleared', () =>
    {
      const { id } = draw({ shape: 'label', text: 'H', size: 48, color: '#4080c0' });
      const label = Debug.scene.getObjectByProperty('uuid', id) as WorldImage;
      let disposed = false;
      label.material.uniforms._MainTex.value.addEventListener('dispose', () =>
      {
        disposed = true;
      });

      expect_color(brightest_in_row(render_frame(0x000000), SIZE / 2), MID_COLOR);

      drawer.clear({ id });

      expect(disposed).toBe(true);
      expect(Debug.scene.children).toEqual([]);
      expect(harness.reported_errors).toEqual([]);
    });
  });
}
