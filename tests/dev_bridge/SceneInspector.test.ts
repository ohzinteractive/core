import { describe, expect, it } from 'vitest';
import { SceneInspector } from '../../src/dev_bridge/SceneInspector';

function vec(x = 0, y = 0, z = 0)
{
  return { x, y, z };
}

function node(overrides: Record<string, unknown> = {})
{
  return {
    uuid: 'u-root',
    name: '',
    type: 'Object3D',
    visible: true,
    position: vec(),
    rotation: vec(),
    scale: vec(1, 1, 1),
    children: [],
    ...overrides
  };
}

function mesh(name: string, overrides: Record<string, unknown> = {})
{
  return node({
    uuid: `u-${name}`,
    name,
    type: 'Mesh',
    material: { type: 'MeshStandardMaterial', name: 'mat' },
    geometry: { attributes: { position: { count: 24 } } },
    ...overrides
  });
}

const inspector = new SceneInspector();

describe('SceneInspector shape', () =>
{
  it('serialises uuid, name and type', () =>
  {
    const result = inspector.inspect(node({ name: 'scene', type: 'Scene', children: [mesh('cube')] }), {});

    expect(result.root?.type).toBe('Scene');
    expect(result.root?.children?.[0]).toMatchObject({ uuid: 'u-cube', name: 'cube', type: 'Mesh' });
  });

  it('omits default rotation, scale and visible to stay lean', () =>
  {
    const result = inspector.inspect(node({ name: 'plain' }), {});

    expect(result.root).not.toHaveProperty('rotation');
    expect(result.root).not.toHaveProperty('scale');
    expect(result.root).not.toHaveProperty('visible');
    expect(result.root).not.toHaveProperty('children');
  });

  it('includes rotation, scale and visible when they differ from the default', () =>
  {
    const result = inspector.inspect(node({ rotation: vec(0, 1.5, 0), scale: vec(2, 2, 2), visible: false }), {});

    expect(result.root?.rotation).toEqual([0, 1.5, 0]);
    expect(result.root?.scale).toEqual([2, 2, 2]);
    expect(result.root?.visible).toBe(false);
  });

  it('rounds long floats rather than serialising full precision', () =>
  {
    const result = inspector.inspect(node({ position: vec(1.123456789, 0, -2.987654321) }), {});

    expect(result.root?.position).toEqual([1.1235, 0, -2.9877]);
  });

  it('reports the material type and vertex count of a mesh', () =>
  {
    const result = inspector.inspect(mesh('cube'), {});

    expect(result.root?.material).toBe('MeshStandardMaterial');
    expect(result.root?.vertices).toBe(24);
  });

  it('summarises a material array by count', () =>
  {
    const result = inspector.inspect(mesh('multi', { material: [{ type: 'A' }, { type: 'B' }] }), {});

    expect(result.root?.material).toBe('2 materials: A, B');
  });

  it('tolerates a node missing every optional field', () =>
  {
    const result = inspector.inspect({ uuid: 'bare' } as never, {});

    expect(result.root?.uuid).toBe('bare');
    expect(result.root?.type).toBe('Object3D');
  });

  it('returns a null root for a missing scene', () =>
  {
    const result = inspector.inspect(null as never, {});

    expect(result.root).toBeNull();
    expect(result.counts.total).toBe(0);
  });
});

describe('SceneInspector budget', () =>
{
  it('stops at the depth limit and says so', () =>
  {
    const deep = node({ children: [node({ uuid: 'a', children: [node({ uuid: 'b', children: [node({ uuid: 'c' })] })] })] });
    const result = inspector.inspect(deep, { depth: 2 });

    const a = result.root?.children?.[0];
    const b = a?.children?.[0];

    expect(b?.uuid).toBe('b');
    expect(b?.children).toBeUndefined();
    expect(b?.truncated).toContain('depth');
    expect(result.truncated).toBe(true);
  });

  it('stops at the node limit and says so', () =>
  {
    const many = node({ children: Array.from({ length: 20 }, (_, i) => node({ uuid: `n${i}` })) });
    const result = inspector.inspect(many, { max_nodes: 5 });

    expect(result.counts.returned).toBeLessThanOrEqual(5);
    expect(result.truncated).toBe(true);
    expect(result.notes.join(' ')).toContain('max_nodes');
  });

  it('counts every node in the scene even when it returns few', () =>
  {
    const many = node({ children: Array.from({ length: 20 }, (_, i) => mesh(`m${i}`)) });
    const result = inspector.inspect(many, { max_nodes: 3 });

    expect(result.counts.total).toBe(21);
    expect(result.counts.meshes).toBe(20);
    expect(result.counts.returned).toBeLessThan(result.counts.total);
  });

  it('applies sane defaults without options', () =>
  {
    const result = inspector.inspect(node({ children: [mesh('cube')] }), {});

    expect(result.truncated).toBe(false);
    expect(result.counts.returned).toBe(2);
  });
});

describe('SceneInspector filter', () =>
{
  it('keeps only branches containing a match', () =>
  {
    const tree = node({
      name: 'root',
      children: [
        node({ uuid: 'keep', name: 'group', children: [mesh('target')] }),
        node({ uuid: 'drop', name: 'other', children: [mesh('unrelated')] })
      ]
    });

    const result = inspector.inspect(tree, { filter: 'target' });
    const kept = result.root?.children ?? [];

    expect(kept).toHaveLength(1);
    expect(kept[0].uuid).toBe('keep');
    expect(kept[0].children?.[0].name).toBe('target');
  });

  it('matches on type as well as name, case insensitively', () =>
  {
    const tree = node({ children: [mesh('cube'), node({ uuid: 'plain' })] });
    const result = inspector.inspect(tree, { filter: 'MESH' });

    expect(result.root?.children).toHaveLength(1);
    expect(result.root?.children?.[0].name).toBe('cube');
  });

  it('reports when a filter matched nothing', () =>
  {
    const result = inspector.inspect(node({ children: [mesh('cube')] }), { filter: 'nothing-here' });

    expect(result.notes.join(' ')).toContain('no nodes matched');
  });

  it('ignores a non-string filter arriving off the wire', () =>
  {
    const result = inspector.inspect(node({ children: [mesh('cube')] }), { filter: 42 });

    expect(result.root?.children).toHaveLength(1);
  });
});
