import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { CameraManager } from '../../src/CameraManager';
import { ModelLoader } from '../../src/dev_bridge/ModelLoader';
import { Graphics } from '../../src/Graphics';
import { ResourceContainer } from '../../src/ResourceContainer';
import { SceneManager } from '../../src/SceneManager';
import { AbstractScene } from '../../src/scenes/AbstractScene';
import { BACKENDS, create_harness, type Harness, SIZE } from '../helpers/webgpu_harness';

// A real GLB made in memory: a red unlit plane, big enough to fill the view.
async function red_plane_url(): Promise<string>
{
  const plane = new Mesh(new PlaneGeometry(100, 100), new MeshBasicMaterial({ color: 0xff0000, side: DoubleSide }));
  const glb = await new GLTFExporter().parseAsync(plane, { binary: true }) as ArrayBuffer;

  return URL.createObjectURL(new Blob([glb], { type: 'model/gltf-binary' }));
}

for (const backend of BACKENDS)
{
  describe(`ModelLoader on WebGPURenderer (${backend.name} backend)`, () =>
  {
    let harness: Harness;
    let loader: ModelLoader;

    beforeEach(async() =>
    {
      harness = await create_harness(backend);
      SceneManager.current = new AbstractScene({ name: 'model_loader_test', compilators: {} });
      ResourceContainer.init();
      loader = new ModelLoader((url) => new GLTFLoader().loadAsync(url), ResourceContainer);
    });

    afterEach(() =>
    {
      harness.dispose();
    });

    it('loads a real GLB, registers it and renders it', async() =>
    {
      // No version: a blob: url cannot take a query string.
      const summary = await loader.load(SceneManager.current, { name: 'plane', url: await red_plane_url() });

      expect(summary).toMatchObject({ name: 'plane', meshes: 1, triangles: 2 });
      expect(ResourceContainer.get('plane').scene.name).toBe('plane');

      CameraManager.current.clear_color.set(0xffffff);
      Graphics.clear(undefined, CameraManager.current, true, false);
      Graphics.render(SceneManager.current, CameraManager.current);

      const center = harness.read_canvas().rgb({ x: SIZE / 2, y: SIZE / 2 });

      expect(center.r).toBeGreaterThan(250);
      expect(center.g).toBeLessThan(5);
      expect(center.b).toBeLessThan(5);
      expect(harness.reported_errors).toEqual([]);
    });

    it('reports load_failed for bytes that are not a GLB', async() =>
    {
      const url = URL.createObjectURL(new Blob(['not a model']));

      await expect(loader.load(SceneManager.current, { name: 'broken', url })).rejects.toMatchObject({ code: 'load_failed' });
    });
  });
}
