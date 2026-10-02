import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Mesh, PlaneGeometry } from 'three';
import { MeshBasicNodeMaterial } from 'three/webgpu';

import { Graphics } from '../../src/Graphics';
import { SceneManager } from '../../src/SceneManager';
import { BaseRender } from '../../src/render_mode/BaseRender';
import { BloomRender } from '../../src/render_mode/BloomRender';
import { NormalRender } from '../../src/render_mode/NormalRender';
import { Blurrer } from '../../src/render_utilities/Blurrer';
import { DualFilteringBlurrer } from '../../src/render_utilities/DualFilteringBlurrer';
import { AbstractScene } from '../../src/scenes/AbstractScene';
import { BACKENDS, create_harness, type Harness, type Pixels, SIZE } from '../helpers/webgpu_harness';

// An 8x8 white quad spanning pixels 12..20 on both axes, counted from the top left corner.
const QUAD_CENTER = { x: 16, y: 16 };
// 2px outside the quad edge, inside the blur radius. One probe per blur pass direction.
const HORIZONTAL_GLOW_PROBE = { x: 22, y: 16 };
const VERTICAL_GLOW_PROBE = { x: 16, y: 22 };
const MIRRORED_PROBE = { x: 16, y: 48 };  // where the quad would land if the image were flipped vertically
const FAR_PROBE = { x: 48, y: 48 };

function build_scene(): AbstractScene
{
  const scene = new AbstractScene({ name: 'bloom_test', compilators: {} });
  const quad = new Mesh(new PlaneGeometry(8, 8), new MeshBasicNodeMaterial({ color: 0xffffff }));

  quad.position.set(QUAD_CENTER.x - SIZE / 2, SIZE / 2 - QUAD_CENTER.y, 0);
  scene.add(quad);

  return scene;
}

for (const backend of BACKENDS)
{
  describe(`BloomRender on WebGPURenderer (${backend.name} backend)`, () =>
  {
    let harness: Harness;

    beforeEach(async() =>
    {
      harness = await create_harness(backend);
      SceneManager.current = build_scene();
    });

    afterEach(() =>
    {
      harness.dispose();
    });

    function render_with(render_mode: BaseRender): Pixels
    {
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
      render_with(new BloomRender());

      expect(harness.reported_errors).toEqual([]);
    });

    it('keeps the scene visible in the right orientation', () =>
    {
      const pixels = render_with(new BloomRender());

      expect(pixels.luminance(QUAD_CENTER)).toBeGreaterThan(200);
      expect(pixels.luminance(MIRRORED_PROBE)).toBeLessThan(5);
      expect(pixels.luminance(FAR_PROBE)).toBeLessThan(5);
    });

    it('spreads a glow around bright pixels, in both blur directions, that plain rendering does not', () =>
    {
      const plain = render_with(new NormalRender());
      expect(plain.luminance(QUAD_CENTER)).toBeGreaterThan(200);
      expect(plain.luminance(HORIZONTAL_GLOW_PROBE)).toBeLessThan(5);
      expect(plain.luminance(VERTICAL_GLOW_PROBE)).toBeLessThan(5);

      const bloomed = render_with(new BloomRender());
      expect(bloomed.luminance(HORIZONTAL_GLOW_PROBE)).toBeGreaterThan(20);
      expect(bloomed.luminance(VERTICAL_GLOW_PROBE)).toBeGreaterThan(20);
    });

    it('blurs with the box Blurrer by default and with the DualFilteringBlurrer when asked', () =>
    {
      const box = new BloomRender();
      const dual = new BloomRender(true);

      render_with(box);
      render_with(dual);

      expect(box.blurrer).toBeInstanceOf(Blurrer);
      expect(dual.blurrer).toBeInstanceOf(DualFilteringBlurrer);
      expect(harness.reported_errors).toEqual([]);
    });

    // The dev bridge builds a new render mode on every switch, so leaving one must free
    // the targets and materials it built on entry, or GPU memory grows with each switch.
    for (const use_dual_filtering of [false, true])
    {
      it(`frees its GPU textures when left (${use_dual_filtering ? 'dual filtering' : 'box'} blur)`, () =>
      {
        render_with(new NormalRender());
        const textures_before = harness.renderer.info.memory.textures;

        for (let i = 0; i < 3; i++)
        {
          render_with(new BloomRender(use_dual_filtering));
          render_with(new NormalRender());
        }

        expect(harness.renderer.info.memory.textures).toBe(textures_before);
        expect(harness.reported_errors).toEqual([]);
      });
    }

    it('renders again when entered after leaving', () =>
    {
      const bloom = new BloomRender(true);

      render_with(bloom);
      render_with(new NormalRender());
      const pixels = render_with(bloom);

      expect(pixels.luminance(QUAD_CENTER)).toBeGreaterThan(200);
      expect(pixels.luminance(HORIZONTAL_GLOW_PROBE)).toBeGreaterThan(20);
      expect(harness.reported_errors).toEqual([]);
    });

    // The dual filtering blur goes down to a sixteenth of the screen, so its glow still
    // reaches 32px away, where the box blur leaves black. At that distance the glow is the
    // same below the quad as beside it, so the image is upright: flipped, the quad itself
    // would land on the mirrored probe.
    it('glows much wider with the DualFilteringBlurrer, upright', () =>
    {
      const pixels = render_with(new BloomRender(true));
      const beside_probe = { x: 48, y: 16 };

      expect(pixels.luminance(QUAD_CENTER)).toBeGreaterThan(200);
      expect(pixels.luminance(HORIZONTAL_GLOW_PROBE)).toBeGreaterThan(20);
      expect(pixels.luminance(VERTICAL_GLOW_PROBE)).toBeGreaterThan(20);
      expect(pixels.luminance(MIRRORED_PROBE)).toBeGreaterThan(5);
      expect(pixels.luminance(MIRRORED_PROBE)).toBeLessThan(50);
      expect(pixels.luminance(MIRRORED_PROBE)).toBe(pixels.luminance(beside_probe));
      expect(pixels.luminance(FAR_PROBE)).toBeLessThan(5);
      expect(harness.reported_errors).toEqual([]);
    });
  });
}
