import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BoxGeometry, Mesh } from 'three';
import { MeshBasicNodeMaterial } from 'three/webgpu';

import { CameraManager } from '../../src/CameraManager';
import { Graphics } from '../../src/Graphics';
import { PerspectiveCamera } from '../../src/PerspectiveCamera';
import { SceneManager } from '../../src/SceneManager';
import { DeferredRender } from '../../src/render_mode/DeferredRender';
import { NormalAORender } from '../../src/render_mode/NormalAORender';
import { NormalRender } from '../../src/render_mode/NormalRender';
import { AbstractScene } from '../../src/scenes/AbstractScene';
import { BACKENDS, create_harness, type Harness } from '../helpers/webgpu_harness';

describe.each(BACKENDS)('depth and normals pre-pass across mode switches ($name backend)', (backend) =>
{
  let harness: Harness;

  beforeEach(async() =>
  {
    harness = await create_harness(backend);

    const camera = new PerspectiveCamera(90, 1, 0.1, 100);
    camera.position.z = 5;
    CameraManager.current = camera;

    const scene = new AbstractScene({ name: 'depth_normal_prepass_test', compilators: {} });
    scene.add(new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicNodeMaterial({ color: 0xffffff })));
    SceneManager.current = scene;
  });

  afterEach(() =>
  {
    vi.restoreAllMocks();
    harness.dispose();
  });

  it('NormalAORender to NormalRender turns it off', () =>
  {
    Graphics.set_state(new NormalAORender(false, true));
    expect(Graphics.generate_depth_normal_texture).toBe(true);

    Graphics.set_state(new NormalRender());
    expect(Graphics.generate_depth_normal_texture).toBe(false);
  });

  it('NormalAORender to DeferredRender keeps it on', () =>
  {
    Graphics.set_state(new NormalAORender(false, true));
    Graphics.set_state(new DeferredRender());

    expect(Graphics.generate_depth_normal_texture).toBe(true);
  });

  it('DeferredRender to NormalAORender keeps it on', () =>
  {
    Graphics.set_state(new DeferredRender());
    Graphics.set_state(new NormalAORender(false, true));

    expect(Graphics.generate_depth_normal_texture).toBe(true);
  });

  it('DeferredRender to NormalRender turns it off', () =>
  {
    Graphics.set_state(new DeferredRender());
    expect(Graphics.generate_depth_normal_texture).toBe(true);

    Graphics.set_state(new NormalRender());
    expect(Graphics.generate_depth_normal_texture).toBe(false);
  });

  it('stops rendering the pre-pass once NormalAORender is left', () =>
  {
    Graphics.set_state(new NormalAORender(false, true));
    Graphics.set_state(new NormalRender());

    const spy = vi.spyOn(Graphics.depth_and_normals_renderer, 'render');
    Graphics.update();

    expect(spy).not.toHaveBeenCalled();
  });

  it('keeps rendering the pre-pass while NormalAORender is active', () =>
  {
    Graphics.set_state(new NormalAORender(false, true));

    const spy = vi.spyOn(Graphics.depth_and_normals_renderer, 'render');
    Graphics.update();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
