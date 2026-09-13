import { describe, expect, it } from 'vitest';
import { SceneEditor } from '../../src/dev_bridge/SceneEditor';

function vec(x = 0, y = 0, z = 0)
{
  return { x, y, z };
}

function make_scene()
{
  const cube = {
    uuid: 'u-cube',
    name: 'cube',
    type: 'Mesh',
    visible: true,
    position: vec(1, 2, 3),
    rotation: vec(),
    scale: vec(1, 1, 1),
    children: [],
    material: { type: 'MeshStandardMaterial' },
    geometry: { attributes: { position: { count: 24 } } }
  };

  const group = {
    uuid: 'u-group',
    name: 'group',
    type: 'Group',
    visible: true,
    position: vec(),
    rotation: vec(),
    scale: vec(1, 1, 1),
    children: [cube]
  };

  const scene = {
    uuid: 'u-scene',
    name: 'HomeScene',
    type: 'Scene',
    visible: true,
    position: vec(),
    rotation: vec(),
    scale: vec(1, 1, 1),
    children: [group]
  };

  return { scene, group, cube };
}

const editor = new SceneEditor();

describe('SceneEditor find', () =>
{
  it('finds by uuid', () =>
  {
    const { scene } = make_scene();

    expect(editor.get(scene, { uuid: 'u-cube' }).name).toBe('cube');
  });

  it('finds by name', () =>
  {
    const { scene } = make_scene();

    expect(editor.get(scene, { name: 'cube' }).uuid).toBe('u-cube');
  });

  it('prefers uuid when both are given', () =>
  {
    const { scene } = make_scene();

    expect(editor.get(scene, { uuid: 'u-group', name: 'cube' }).name).toBe('group');
  });

  it('throws not_found with an explicit code for an unknown selector', () =>
  {
    const { scene } = make_scene();

    expect(() => editor.get(scene, { name: 'ghost' })).toThrowError(
      expect.objectContaining({ code: 'not_found' })
    );
  });

  it('throws not_found when no scene is set', () =>
  {
    expect(() => editor.get(null as never, { name: 'cube' })).toThrowError(
      expect.objectContaining({ code: 'not_found' })
    );
  });

  it('requires a selector', () =>
  {
    const { scene } = make_scene();

    expect(() => editor.get(scene, {})).toThrowError(
      expect.objectContaining({ code: 'not_found' })
    );
  });
});

describe('SceneEditor get detail', () =>
{
  it('always reports the full transform, parent and child count', () =>
  {
    const { scene } = make_scene();
    const detail = editor.get(scene, { name: 'cube' });

    expect(detail.position).toEqual([1, 2, 3]);
    expect(detail.rotation).toEqual([0, 0, 0]);
    expect(detail.scale).toEqual([1, 1, 1]);
    expect(detail.parent).toBe('group');
    expect(detail.children).toBe(0);
    expect(detail.material).toBe('MeshStandardMaterial');
    expect(detail.vertices).toBe(24);
  });

  it('reports the scene root as having no parent', () =>
  {
    const { scene } = make_scene();

    expect(editor.get(scene, { uuid: 'u-scene' }).parent).toBeNull();
  });
});

describe('SceneEditor set', () =>
{
  it('moves an object and returns its new state', () =>
  {
    const { scene, cube } = make_scene();
    const detail = editor.set(scene, { name: 'cube' }, { position: [5, 0, -2] });

    expect(cube.position).toEqual({ x: 5, y: 0, z: -2 });
    expect(detail.position).toEqual([5, 0, -2]);
  });

  it('leaves axes the caller omitted untouched', () =>
  {
    const { scene, cube } = make_scene();

    editor.set(scene, { name: 'cube' }, { position: [9] });

    expect(cube.position).toEqual({ x: 9, y: 2, z: 3 });
  });

  it('sets rotation, scale and visibility', () =>
  {
    const { scene, cube } = make_scene();

    editor.set(scene, { name: 'cube' }, { rotation: [0, 1.5, 0], scale: [2, 2, 2], visible: false });

    expect(cube.rotation).toEqual({ x: 0, y: 1.5, z: 0 });
    expect(cube.scale).toEqual({ x: 2, y: 2, z: 2 });
    expect(cube.visible).toBe(false);
  });

  it('ignores non-numeric axis values arriving off the wire', () =>
  {
    const { scene, cube } = make_scene();

    editor.set(scene, { name: 'cube' }, { position: ['5', null, 7] as never });

    expect(cube.position).toEqual({ x: 1, y: 2, z: 7 });
  });

  it('ignores a non-boolean visible', () =>
  {
    const { scene, cube } = make_scene();

    editor.set(scene, { name: 'cube' }, { visible: 'no' as never });

    expect(cube.visible).toBe(true);
  });

  it('reports which fields it actually changed', () =>
  {
    const { scene } = make_scene();
    const detail = editor.set(scene, { name: 'cube' }, { position: [5, 0, -2], visible: false });

    expect(detail.changed).toEqual(['position', 'visible']);
  });

  it('reports an empty change list when nothing valid was supplied', () =>
  {
    const { scene } = make_scene();
    const detail = editor.set(scene, { name: 'cube' }, {});

    expect(detail.changed).toEqual([]);
  });
});
