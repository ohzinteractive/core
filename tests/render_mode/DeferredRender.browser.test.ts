import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Mesh, PlaneGeometry, SphereGeometry } from 'three';
import { MeshBasicNodeMaterial } from 'three/webgpu';

import { CameraManager } from '../../src/CameraManager';
import { Graphics } from '../../src/Graphics';
import { PerspectiveCamera } from '../../src/PerspectiveCamera';
import { SceneManager } from '../../src/SceneManager';
import { DeferredPointLightMaterial } from '../../src/materials/deferred/DeferredPointLightMaterial';
import { DeferredRender } from '../../src/render_mode/DeferredRender';
import { AbstractScene } from '../../src/scenes/AbstractScene';
import { BACKENDS, create_harness, type Harness, type Pixels, SIZE } from '../helpers/webgpu_harness';

// A 90 degree camera 5 units in front of a wall at z = 0 sees the wall from -5 to 5
// on both axes, so one pixel covers 10 / SIZE world units.
const CAMERA_DISTANCE = 5;
const VISIBLE_HALF_EXTENT = 5;

// Pixel coordinates are counted from the top left corner of the 64x64 canvas.
const UNDER_LIGHT = { x: 16, y: 16 };     // world (-2.5, 2.5) on the wall
const MIRRORED_PROBE = { x: 16, y: 48 };  // where the light would land if the image were flipped vertically
const FAR_PROBE = { x: 48, y: 48 };

const LIGHT_POSITION = { x: -2.5, y: 2.5 };
// Big enough to contain the camera, so its back faces cover the whole screen.
const LIGHT_VOLUME_RADIUS = 20;

function world_at(probe: { x: number, y: number })
{
  const world_per_pixel = VISIBLE_HALF_EXTENT * 2 / SIZE;

  return {
    x: probe.x * world_per_pixel - VISIBLE_HALF_EXTENT,
    y: VISIBLE_HALF_EXTENT - probe.y * world_per_pixel
  };
}

function wall(color: number): AbstractScene
{
  const scene = new AbstractScene({ name: 'deferred_test', compilators: {} });

  scene.add(new Mesh(new PlaneGeometry(20, 20), new MeshBasicNodeMaterial({ color })));

  return scene;
}

function point_light(z: number, intensity: number): Mesh
{
  const light = new Mesh(new SphereGeometry(LIGHT_VOLUME_RADIUS), new DeferredPointLightMaterial(intensity));

  light.position.set(LIGHT_POSITION.x, LIGHT_POSITION.y, z);

  return light;
}

for (const backend of BACKENDS)
{
  describe(`DeferredRender on WebGPURenderer (${backend.name} backend)`, () =>
  {
    let harness: Harness;
    let render_mode: DeferredRender;

    beforeEach(async() =>
    {
      harness = await create_harness(backend);

      const camera = new PerspectiveCamera(90, 1, 0.1, 100);
      camera.position.z = CAMERA_DISTANCE;
      CameraManager.current = camera;

      SceneManager.current = wall(0xff0000);

      render_mode = new DeferredRender();
      Graphics.set_state(render_mode);
    });

    afterEach(() =>
    {
      harness.dispose();
    });

    function with_lights(...lights: Mesh[])
    {
      render_mode.scene_lights.clear();
      lights.forEach(light => render_mode.scene_lights.add(light));
    }

    function render_frames(): Pixels
    {
      Graphics.update();
      Graphics.update();

      return harness.read_canvas();
    }

    it(`runs on the ${backend.name} backend`, () =>
    {
      expect(harness.uses_backend()).toBe(true);
    });

    it('asks Graphics for the depth and normals buffer it lights from', () =>
    {
      expect(Graphics.generate_depth_normal_texture).toBe(true);
    });

    it('renders its default lights without reporting incompatible materials or errors', () =>
    {
      render_frames();

      expect(harness.reported_errors).toEqual([]);
    });

    it('lights the surface under a point light with its albedo, in the right orientation', () =>
    {
      expect(world_at(UNDER_LIGHT)).toEqual(LIGHT_POSITION);
      with_lights(point_light(1, 1));

      const pixels = render_frames();
      const lit = pixels.rgb(UNDER_LIGHT);

      expect(lit.r).toBeGreaterThan(200);
      expect(lit.g).toBeLessThan(10);
      expect(lit.b).toBeLessThan(10);
      expect(pixels.rgb(MIRRORED_PROBE).r).toBeLessThan(60);
      expect(pixels.rgb(FAR_PROBE).r).toBeLessThan(30);
    });

    it('takes the color of whatever surface is underneath', () =>
    {
      SceneManager.current = wall(0x00ff00);
      with_lights(point_light(1, 1));

      const lit = render_frames().rgb(UNDER_LIGHT);

      expect(lit.r).toBeLessThan(10);
      expect(lit.g).toBeGreaterThan(200);
    });

    it('fades the light with the distance to the surface', () =>
    {
      with_lights(point_light(1, 1));
      const near = render_frames().rgb(UNDER_LIGHT).r;

      with_lights(point_light(3, 1));
      const far = render_frames().rgb(UNDER_LIGHT).r;

      expect(far).toBeLessThan(near - 50);
      expect(far).toBeGreaterThan(20);
    });

    it('leaves surfaces that face away from the light dark', () =>
    {
      with_lights(point_light(-1, 1));

      expect(render_frames().rgb(UNDER_LIGHT).r).toBeLessThan(5);
    });

    it('adds overlapping lights together', () =>
    {
      with_lights(point_light(1, 0.1));
      const one = render_frames().rgb(UNDER_LIGHT).r;

      with_lights(point_light(1, 0.1), point_light(1, 0.1));
      const two = render_frames().rgb(UNDER_LIGHT).r;

      expect(one).toBeGreaterThan(40);
      expect(two).toBeGreaterThan(one + 20);
    });
  });
}
