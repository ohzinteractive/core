import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Mesh, PlaneGeometry } from 'three';
import { MeshBasicNodeMaterial } from 'three/webgpu';

import { Graphics } from '../../src/Graphics';
import { SceneManager } from '../../src/SceneManager';
import { BaseRender } from '../../src/render_mode/BaseRender';
import { NormalRender } from '../../src/render_mode/NormalRender';
import { UnrealBloomRender } from '../../src/render_mode/UnrealBloomRender';
import { AbstractScene } from '../../src/scenes/AbstractScene';
import { BACKENDS, create_harness, type Harness, type Pixels, SIZE } from '../helpers/webgpu_harness';

// An 8x8 white quad spanning pixels 12..20 on both axes, counted from the top left corner.
const QUAD_CENTER = { x: 16, y: 16 };
// 2px outside the quad edge. One probe per blur pass direction.
const HORIZONTAL_GLOW_PROBE = { x: 22, y: 16 };
const VERTICAL_GLOW_PROBE = { x: 16, y: 22 };
// Where the quad and its near glow would land if the image were flipped vertically.
const MIRRORED_PROBE = { x: 16, y: 48 };
const MIRRORED_GLOW_PROBE = { x: 22, y: 48 };

const CONFIGURATIONS = [
  { name: 'default', antialiasing: false, half_float: false, high_pass: false },
  { name: 'antialiasing', antialiasing: true, half_float: false, high_pass: false },
  { name: 'half float', antialiasing: false, half_float: true, high_pass: false },
  { name: 'luminosity high pass', antialiasing: false, half_float: false, high_pass: true },
  { name: 'everything enabled', antialiasing: true, half_float: true, high_pass: true }
];

function build_scene(): AbstractScene
{
  const scene = new AbstractScene({ name: 'unreal_bloom_test', compilators: {} });
  const quad = new Mesh(new PlaneGeometry(8, 8), new MeshBasicNodeMaterial({ color: 0xffffff }));

  quad.position.set(QUAD_CENTER.x - SIZE / 2, SIZE / 2 - QUAD_CENTER.y, 0);
  scene.add(quad);

  return scene;
}

function create_bloom({ antialiasing = false, half_float = false, high_pass = false } = {})
{
  return new UnrealBloomRender(antialiasing, half_float, high_pass);
}

for (const backend of BACKENDS)
{
  describe(`UnrealBloomRender on WebGPURenderer (${backend.name} backend)`, () =>
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

    function render_with(render_mode: BaseRender, configure?: () => void): Pixels
    {
      Graphics.set_state(render_mode);
      configure?.();
      render_mode.render();
      render_mode.render();

      return harness.read_canvas();
    }

    it(`runs on the ${backend.name} backend`, () =>
    {
      expect(harness.uses_backend()).toBe(true);
    });

    it.each(CONFIGURATIONS)('renders the scene without errors ($name)', (configuration) =>
    {
      const pixels = render_with(create_bloom(configuration));

      expect(harness.reported_errors).toEqual([]);
      expect(pixels.luminance(QUAD_CENTER)).toBeGreaterThan(200);
    });

    it('keeps the scene and its glow in the right orientation', () =>
    {
      const pixels = render_with(create_bloom());

      expect(pixels.luminance(QUAD_CENTER)).toBeGreaterThan(200);
      expect(pixels.luminance(MIRRORED_PROBE)).toBeLessThan(pixels.luminance(QUAD_CENTER) / 2);
      expect(pixels.luminance(HORIZONTAL_GLOW_PROBE)).toBeGreaterThan(pixels.luminance(MIRRORED_GLOW_PROBE) + 20);
    });

    it('spreads a glow around bright pixels, in both blur directions, that plain rendering does not', () =>
    {
      const plain = render_with(new NormalRender());
      expect(plain.luminance(HORIZONTAL_GLOW_PROBE)).toBeLessThan(5);
      expect(plain.luminance(VERTICAL_GLOW_PROBE)).toBeLessThan(5);

      const bloomed = render_with(create_bloom());
      expect(bloomed.luminance(HORIZONTAL_GLOW_PROBE)).toBeGreaterThan(20);
      expect(bloomed.luminance(VERTICAL_GLOW_PROBE)).toBeGreaterThan(20);
    });

    it('adds no glow at zero bloom strength', () =>
    {
      const pixels = render_with(create_bloom(), () =>
      {
        (Graphics.current_render_mode as UnrealBloomRender).set_bloom_strength(0);
      });

      expect(pixels.luminance(QUAD_CENTER)).toBeGreaterThan(200);
      expect(pixels.luminance(HORIZONTAL_GLOW_PROBE)).toBeLessThan(5);
    });

    it('only blooms pixels above the luminosity threshold when the high pass is enabled', () =>
    {
      const below = render_with(create_bloom({ high_pass: true }), () =>
      {
        (Graphics.current_render_mode as UnrealBloomRender).set_luminosity_threshold(1.5);
      });
      expect(below.luminance(QUAD_CENTER)).toBeGreaterThan(200);
      expect(below.luminance(HORIZONTAL_GLOW_PROBE)).toBeLessThan(5);

      const above = render_with(create_bloom({ high_pass: true }), () =>
      {
        (Graphics.current_render_mode as UnrealBloomRender).set_luminosity_threshold(0.5);
      });
      expect(above.luminance(HORIZONTAL_GLOW_PROBE)).toBeGreaterThan(20);
    });

    it('tints the glow with the mip tint colors', () =>
    {
      const pixels = render_with(create_bloom(), () =>
      {
        const bloom = Graphics.current_render_mode as UnrealBloomRender;

        bloom.set_tint_color_0('#ff0000');
        bloom.set_tint_color_1('#ff0000');
        bloom.set_tint_color_2('#ff0000');
        bloom.set_tint_color_3('#ff0000');
        bloom.set_tint_color_4('#ff0000');
      });

      const glow = pixels.rgb(HORIZONTAL_GLOW_PROBE);
      expect(glow.r).toBeGreaterThan(20);
      expect(glow.g).toBeLessThan(5);
      expect(glow.b).toBeLessThan(5);
    });
  });
}
