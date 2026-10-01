import { beforeEach, describe, expect, it } from 'vitest';

import { Box3, BoxGeometry, Mesh, MeshBasicMaterial, type PlaneGeometry, type SphereGeometry, Vector3 } from 'three';

import { Debug } from '../../src/Debug';
import { DebugDrawer } from '../../src/dev_bridge/DebugDrawer';
import { OScreen } from '../../src/OScreen';
import { SceneManager } from '../../src/SceneManager';
import { AbstractScene } from '../../src/scenes/AbstractScene';

function caught(action: () => unknown): { code?: string, message: string }
{
  try
  {
    action();
  }
  catch (error)
  {
    return error as { code?: string, message: string };
  }

  throw new Error('Expected the call to throw.');
}

function color_of(mesh: Mesh): number
{
  return (mesh.material as MeshBasicMaterial).color.getHex();
}

describe('DebugDrawer', () =>
{
  let drawer: DebugDrawer;

  const draw = (request: Record<string, unknown>) => drawer.draw(Debug, SceneManager.current, request);

  beforeEach(() =>
  {
    OScreen.init();
    SceneManager.init();
    SceneManager.current = new AbstractScene({ name: 'drawer_test', compilators: {} });
    Debug.init();
    drawer = new DebugDrawer();
  });

  describe('draw', () =>
  {
    it('draws a red unit cube at the origin into the debug scene', () =>
    {
      const result = draw({ shape: 'cube' });
      const cube = Debug.scene.children[0] as Mesh<BoxGeometry>;

      expect(result).toEqual({ id: cube.uuid, shape: 'cube', helpers: 1 });
      expect(cube.position).toEqual(new Vector3());
      expect(cube.geometry.parameters.width).toBe(1);
      expect(color_of(cube)).toBe(0xff0000);
      expect(SceneManager.current.children).toEqual([]);
    });

    it('positions, sizes and colors a cube', () =>
    {
      draw({ shape: 'cube', position: [1, 2, 3], size: 4, color: '#0000ff' });
      const cube = Debug.scene.children[0] as Mesh<BoxGeometry>;

      expect(cube.position).toEqual(new Vector3(1, 2, 3));
      expect(cube.geometry.parameters.height).toBe(4);
      expect(color_of(cube)).toBe(0x0000ff);
    });

    it('draws a black cube and sphere when the color is 0', () =>
    {
      draw({ shape: 'cube', color: 0 });
      draw({ shape: 'sphere', color: 0 });

      expect(Debug.scene.children.map((child) => color_of(child as Mesh))).toEqual([0x000000, 0x000000]);
    });

    it('draws a sphere whose size is its radius', () =>
    {
      const result = draw({ shape: 'sphere', position: [1, 2, 3], size: 5, color: 0x00ff00 });
      const sphere = Debug.scene.children[0] as Mesh<SphereGeometry>;

      expect(result.id).toBe(sphere.uuid);
      expect(sphere.position).toEqual(new Vector3(1, 2, 3));
      expect(sphere.geometry.parameters.radius).toBe(5);
      expect(color_of(sphere)).toBe(0x00ff00);
    });

    it('draws a green plane of size by size at the position', () =>
    {
      const result = draw({ shape: 'plane', position: [1, 2, 3], size: 6 });
      const plane = Debug.scene.children[0] as Mesh<PlaneGeometry>;

      expect(result.id).toBe(plane.uuid);
      expect(plane.position).toEqual(new Vector3(1, 2, 3));
      expect(plane.geometry.parameters.width).toBe(6);
      expect(plane.geometry.parameters.height).toBe(6);
      expect(color_of(plane)).toBe(0x00ff00);
    });

    it('draws a math_sphere into the current scene', () =>
    {
      const result = draw({ shape: 'math_sphere', position: [1, 2, 3], size: 5, color: 0x0000ff });
      const sphere = SceneManager.current.children[0] as Mesh<SphereGeometry>;

      expect(result.id).toBe(sphere.uuid);
      expect(sphere.position).toEqual(new Vector3(1, 2, 3));
      expect(sphere.geometry.parameters.radius).toBe(5);
      expect(color_of(sphere)).toBe(0x0000ff);
      expect(Debug.scene.children).toEqual([]);
    });

    it('defaults math_sphere to red', () =>
    {
      draw({ shape: 'math_sphere' });

      expect(color_of(SceneManager.current.children[0] as Mesh)).toBe(0xff0000);
    });

    it('counts the live helpers', () =>
    {
      expect(draw({ shape: 'cube' }).helpers).toBe(1);
      expect(draw({ shape: 'sphere' }).helpers).toBe(2);
      expect(draw({ shape: 'plane' }).helpers).toBe(3);
    });
  });

  describe('bounding_box', () =>
  {
    function add_target(name: string, x: number): Mesh
    {
      const target = new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial());
      target.name = name;
      target.position.set(x, 0, 0);
      SceneManager.current.add(target);
      target.updateMatrixWorld(true);

      return target;
    }

    it('bounds an object found by name in world space, in yellow, ignoring position and size', () =>
    {
      const target = add_target('crate', 10);
      const result = draw({ shape: 'bounding_box', object: { name: 'crate' }, position: [5, 5, 5], size: 9 });
      const helper = SceneManager.current.children[1] as unknown as { box: Box3, uuid: string, material: MeshBasicMaterial };

      expect(result).toEqual({ id: helper.uuid, shape: 'bounding_box', helpers: 1 });
      expect(helper.box).toEqual(new Box3().setFromObject(target));
      expect(helper.box.min.x).toBe(9);
      expect(helper.material.color.getHex()).toBe(0xffff00);
    });

    it('honors the color', () =>
    {
      add_target('crate', 0);
      draw({ shape: 'bounding_box', object: { name: 'crate' }, color: 0x00ffff });
      const helper = SceneManager.current.children[1] as unknown as { material: MeshBasicMaterial };

      expect(helper.material.color.getHex()).toBe(0x00ffff);
    });

    it('finds an object by uuid, which wins over name', () =>
    {
      const by_name = add_target('crate', 10);
      const by_uuid = add_target('other', -10);

      draw({ shape: 'bounding_box', object: { name: by_name.name, uuid: by_uuid.uuid } });
      const helper = SceneManager.current.children[2] as unknown as { box: Box3 };

      expect(helper.box).toEqual(new Box3().setFromObject(by_uuid));
    });

    it('is not_found when the object is not in the current scene', () =>
    {
      expect(caught(() => draw({ shape: 'bounding_box', object: { name: 'ghost' } })).code).toBe('not_found');
      expect(caught(() => draw({ shape: 'bounding_box', object: { uuid: 'nope' } })).code).toBe('not_found');
    });

    it('is bad_request without an object that has a name or uuid', () =>
    {
      expect(caught(() => draw({ shape: 'bounding_box' })).code).toBe('bad_request');
      expect(caught(() => draw({ shape: 'bounding_box', object: {} })).code).toBe('bad_request');
      expect(caught(() => draw({ shape: 'bounding_box', object: { name: 3 } })).code).toBe('bad_request');
    });

    it('is bad_request when the target has no geometry, naming it', () =>
    {
      const empty = new Mesh();
      empty.name = 'hollow';
      SceneManager.current.add(empty);
      const error = caught(() => draw({ shape: 'bounding_box', object: { name: 'hollow' } }));

      expect(error.code).toBe('bad_request');
      expect(error.message).toContain('hollow');
    });
  });

  describe('validation', () =>
  {
    it('rejects an unknown or missing shape and lists the valid ones', () =>
    {
      const unknown = caught(() => draw({ shape: 'torus' }));

      expect(unknown.code).toBe('bad_request');

      for (const shape of ['cube', 'sphere', 'plane', 'math_sphere', 'bounding_box'])
      {
        expect(unknown.message).toContain(shape);
      }

      expect(caught(() => draw({})).code).toBe('bad_request');
    });

    it('rejects a malformed position', () =>
    {
      for (const position of ['0,0,0', [1, 2], [1, 2, 'x'], [1, 2, Infinity], [1, 2, NaN]])
      {
        expect(caught(() => draw({ shape: 'cube', position })).code).toBe('bad_request');
      }
    });

    it('rejects a malformed size', () =>
    {
      for (const size of [0, -1, Infinity, NaN, '2'])
      {
        expect(caught(() => draw({ shape: 'cube', size })).code).toBe('bad_request');
      }
    });

    it('rejects a color that is neither a number nor a string', () =>
    {
      expect(caught(() => draw({ shape: 'cube', color: { r: 1 } })).code).toBe('bad_request');
      expect(caught(() => draw({ shape: 'cube', color: true })).code).toBe('bad_request');
    });

    it('draws nothing when a request is rejected', () =>
    {
      caught(() => draw({ shape: 'cube', size: -1 }));

      expect(Debug.scene.children).toEqual([]);
    });
  });

  describe('clear', () =>
  {
    it('removes one helper by id and disposes its geometry', () =>
    {
      const first = draw({ shape: 'cube' });
      const second = draw({ shape: 'sphere' });
      const cube = Debug.scene.children[0] as Mesh;
      let disposed = false;
      cube.geometry.addEventListener('dispose', () => { disposed = true; });

      expect(drawer.clear({ id: first.id })).toEqual({ removed: 1, helpers: 1 });
      expect(disposed).toBe(true);
      expect(Debug.scene.children.map((child) => child.uuid)).toEqual([second.id]);
    });

    it('disposes every material of a helper', () =>
    {
      draw({ shape: 'cube' });
      const cube = Debug.scene.children[0] as Mesh;
      const materials = [new MeshBasicMaterial(), new MeshBasicMaterial()];
      cube.material = materials;
      let disposed = 0;
      materials.forEach((material) => material.addEventListener('dispose', () => { disposed++; }));

      drawer.clear({});

      expect(disposed).toBe(2);
    });

    it('removes every tracked helper but leaves the ones the app drew itself', () =>
    {
      const own = Debug.draw_cube();
      draw({ shape: 'cube' });
      draw({ shape: 'math_sphere' });

      expect(drawer.clear({})).toEqual({ removed: 2, helpers: 0 });
      expect(Debug.scene.children).toEqual([own]);
      expect(SceneManager.current.children).toEqual([]);
    });

    it('reports removed 0 on a second clear', () =>
    {
      draw({ shape: 'cube' });
      drawer.clear({});

      expect(drawer.clear({})).toEqual({ removed: 0, helpers: 0 });
    });

    it('is not_found for an id it does not track, including one drawn by the app', () =>
    {
      const own = Debug.draw_cube();

      expect(caught(() => drawer.clear({ id: 'nope' })).code).toBe('not_found');
      expect(caught(() => drawer.clear({ id: own.uuid })).code).toBe('not_found');
      expect(Debug.scene.children).toEqual([own]);
    });

    it('does not throw for a helper whose scene was replaced', () =>
    {
      const result = draw({ shape: 'math_sphere' });
      SceneManager.current = new AbstractScene({ name: 'next', compilators: {} });

      expect(drawer.clear({ id: result.id })).toEqual({ removed: 1, helpers: 0 });
    });
  });
});
