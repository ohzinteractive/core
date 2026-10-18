import { BoxGeometry, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, Scene } from 'three';
import { color } from 'three/tsl';
import { MeshStandardNodeMaterial } from 'three/webgpu';
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

function make_material_scene()
{
  const standard = new MeshStandardMaterial({ color: 0xffffff, roughness: 1, metalness: 0 });
  const basic = new MeshBasicMaterial({ color: 0xffffff });
  const shared = new MeshStandardMaterial();

  const cube = new Mesh(new BoxGeometry(), standard);
  cube.name = 'cube';

  const flat = new Mesh(new BoxGeometry(), basic);
  flat.name = 'flat';

  const left = new Mesh(new BoxGeometry(), shared);
  left.name = 'left';

  const right = new Mesh(new BoxGeometry(), shared);
  right.name = 'right';

  const model = new Group();
  model.name = 'model';
  model.add(left, right);

  const scene = new Scene();
  scene.add(cube, flat, model);

  return { scene, standard, basic, shared };
}

describe('SceneEditor set_material', () =>
{
  it('sets color and emissive from sRGB hex and reports them back as hex', () =>
  {
    const { scene, standard } = make_material_scene();
    const result = editor.set_material(scene, { name: 'cube' }, { color: '#ff8800', emissive: '00ff00' });

    expect(standard.color.getHexString()).toBe('ff8800');
    expect(standard.emissive.getHexString()).toBe('00ff00');
    expect(result.materials[0].color).toBe('#ff8800');
    expect(result.materials[0].emissive).toBe('#00ff00');
  });

  it('sets roughness, metalness, emissive intensity and wireframe', () =>
  {
    const { scene, standard } = make_material_scene();

    editor.set_material(scene, { name: 'cube' }, { roughness: 0.25, metalness: 0.75, emissive_intensity: 3, wireframe: true });

    expect(standard.roughness).toBe(0.25);
    expect(standard.metalness).toBe(0.75);
    expect(standard.emissiveIntensity).toBe(3);
    expect(standard.wireframe).toBe(true);
  });

  it('turns transparency on when opacity drops below 1, so the change is visible', () =>
  {
    const { scene, standard } = make_material_scene();
    const version = standard.version;
    const result = editor.set_material(scene, { name: 'cube' }, { opacity: 0.5 });

    expect(standard.opacity).toBe(0.5);
    expect(standard.transparent).toBe(true);
    expect(standard.version).toBeGreaterThan(version);
    expect(result.materials[0].transparent).toBe(true);
  });

  it('flags the material for a rebuild when wireframe flips', () =>
  {
    const { scene, standard } = make_material_scene();
    const version = standard.version;

    editor.set_material(scene, { name: 'cube' }, { wireframe: true });

    expect(standard.version).toBeGreaterThan(version);
  });

  it('reports which fields it changed', () =>
  {
    const { scene } = make_material_scene();
    const result = editor.set_material(scene, { name: 'cube' }, { color: '#000000', wireframe: true });

    expect(result.changed).toEqual(['color', 'wireframe']);
  });

  it('skips fields the material does not have and says so', () =>
  {
    const { scene, basic } = make_material_scene();
    const result = editor.set_material(scene, { name: 'flat' }, { color: '#ff0000', roughness: 0.2 });

    expect(basic.color.getHexString()).toBe('ff0000');
    expect((basic as unknown as { roughness?: number }).roughness).toBeUndefined();
    expect(result.changed).toEqual(['color']);
    expect(result.notes).toContain('roughness: MeshBasicMaterial has no roughness, skipped.');
  });

  it('ignores invalid values arriving off the wire', () =>
  {
    const { scene, standard } = make_material_scene();
    const result = editor.set_material(scene, { name: 'cube' }, {
      color: 'orange',
      roughness: 2,
      metalness: Number.NaN,
      opacity: '0.5' as never,
      emissive_intensity: -1,
      wireframe: 'yes' as never
    });

    expect(standard.color.getHexString()).toBe('ffffff');
    expect(standard.roughness).toBe(1);
    expect(standard.metalness).toBe(0);
    expect(standard.opacity).toBe(1);
    expect(standard.emissiveIntensity).toBe(1);
    expect(standard.wireframe).toBe(false);
    expect(result.changed).toEqual([]);
  });

  it('edits every material under an object that has none of its own, once each', () =>
  {
    const { scene, shared } = make_material_scene();
    const result = editor.set_material(scene, { name: 'model' }, { roughness: 0.3 });

    expect(shared.roughness).toBe(0.3);
    expect(result.meshes).toBe(2);
    expect(result.materials).toHaveLength(1);
  });

  it('edits every slot of a multi-material mesh', () =>
  {
    const { scene } = make_material_scene();
    const first = new MeshStandardMaterial();
    const second = new MeshStandardMaterial();
    const multi = new Mesh(new BoxGeometry(), [first, second]);
    multi.name = 'multi';
    scene.add(multi);

    editor.set_material(scene, { name: 'multi' }, { metalness: 1 });

    expect(first.metalness).toBe(1);
    expect(second.metalness).toBe(1);
  });

  it('counts how many meshes in the scene share each material', () =>
  {
    const { scene } = make_material_scene();
    const result = editor.set_material(scene, { name: 'left' }, {});

    expect(result.materials[0].users).toBe(2);
  });

  it('returns the current state unchanged when no changes are given', () =>
  {
    const { scene } = make_material_scene();
    const result = editor.set_material(scene, { name: 'cube' }, {});

    expect(result.changed).toEqual([]);
    expect(result.materials[0]).toMatchObject({
      type: 'MeshStandardMaterial',
      color: '#ffffff',
      roughness: 1,
      metalness: 0,
      emissive: '#000000',
      emissive_intensity: 1,
      opacity: 1,
      transparent: false,
      wireframe: false,
      users: 1
    });
  });

  it('warns when a node input overrides the value it just set', () =>
  {
    const { scene, standard } = make_material_scene();
    (standard as unknown as { colorNode: unknown }).colorNode = {};

    const result = editor.set_material(scene, { name: 'cube' }, { color: '#ff0000' });

    expect(result.notes.some((note) => note.includes('colorNode'))).toBe(true);
  });

  it('edits only the object\'s own material when it has one, not its children', () =>
  {
    const { scene, standard } = make_material_scene();
    const child_material = new MeshStandardMaterial({ color: 0xffffff });
    const wheel = new Mesh(new BoxGeometry(), child_material);
    wheel.name = 'wheel';
    scene.getObjectByName('cube').add(wheel);

    const result = editor.set_material(scene, { name: 'cube' }, { color: '#ff0000' });

    expect(standard.color.getHexString()).toBe('ff0000');
    expect(child_material.color.getHexString()).toBe('ffffff');
    expect(result.meshes).toBe(1);
  });

  it('stores hex colors in the linear working space', () =>
  {
    const { scene, standard } = make_material_scene();

    editor.set_material(scene, { name: 'cube' }, { color: '#808080' });

    expect(standard.color.r).toBeCloseTo(0.2159, 3);
  });

  it('turns transparency off when asked, and rebuilds the material', () =>
  {
    const { scene, standard } = make_material_scene();
    editor.set_material(scene, { name: 'cube' }, { opacity: 0.5 });
    const version = standard.version;

    const result = editor.set_material(scene, { name: 'cube' }, { opacity: 1, transparent: false });

    expect(standard.transparent).toBe(false);
    expect(standard.version).toBeGreaterThan(version);
    expect(result.changed).toEqual(['opacity', 'transparent']);
  });

  it('keeps an explicit transparent: false even when opacity drops below 1 in the same call', () =>
  {
    const { scene, standard } = make_material_scene();

    editor.set_material(scene, { name: 'cube' }, { opacity: 0.5, transparent: false });

    expect(standard.transparent).toBe(false);
  });

  it('edits a real TSL node material and warns about its node inputs', () =>
  {
    const material = new MeshStandardNodeMaterial();
    const mesh = new Mesh(new BoxGeometry(), material);
    mesh.name = 'node_mesh';
    const scene = new Scene();
    scene.add(mesh);

    const plain = editor.set_material(scene, { name: 'node_mesh' }, { color: '#00ff00', roughness: 0.4 });

    expect(material.color.getHexString()).toBe('00ff00');
    expect(material.roughness).toBe(0.4);
    expect(plain.notes).toEqual([]);

    material.colorNode = color(0xff0000);
    const overridden = editor.set_material(scene, { name: 'node_mesh' }, { color: '#0000ff' });

    expect(overridden.notes.some((note) => note.includes('colorNode'))).toBe(true);
  });

  it('throws not_found when the object has no material anywhere under it', () =>
  {
    const { scene } = make_material_scene();
    const empty = new Group();
    empty.name = 'empty';
    scene.add(empty);

    expect(() => editor.set_material(scene, { name: 'empty' }, { color: '#ff0000' })).toThrowError(
      expect.objectContaining({ code: 'not_found' })
    );
  });

  it('throws not_found for an unknown selector', () =>
  {
    const { scene } = make_material_scene();

    expect(() => editor.set_material(scene, { name: 'ghost' }, {})).toThrowError(
      expect.objectContaining({ code: 'not_found' })
    );
  });
});
