import { describe, expect, it } from 'vitest';

import { Color, Vector3 } from 'three';

import { Line } from '../../src/components/Line';
import { LineMaterial } from '../../src/materials/LineMaterial';

// Three points with segments of length 3 and 4.
function bent_points(): Vector3[]
{
  return [new Vector3(0, 0, 0), new Vector3(3, 0, 0), new Vector3(3, 4, 0)];
}

function values(line: Line, name: string): number[]
{
  return Array.from(line.geometry.getAttribute(name).array);
}

describe('Line', () =>
{
  it('draws with a LineMaterial', () =>
  {
    expect(new Line(bent_points()).material).toBeInstanceOf(LineMaterial);
  });

  it('stores every point twice, once per edge of the ribbon, joined by two triangles per segment', () =>
  {
    const line = new Line(bent_points());

    expect(line.geometry.getAttribute('position').count).toBe(6);
    expect(values(line, 'orientation')).toEqual([1, -1, 1, -1, 1, -1]);
    expect(values(line, 'coverage')).toEqual([0, 0, 3, 3, 7, 7]);
    expect(line.geometry.index.count).toBe(12);
  });

  it('gives each point its neighbors, mirroring them past both ends', () =>
  {
    const line = new Line(bent_points());

    expect(values(line, 'previous_position').slice(0, 3)).toEqual([-3, 0, 0]);
    expect(values(line, 'previous_position').slice(6, 9)).toEqual([0, 0, 0]);
    expect(values(line, 'next_position').slice(6, 9)).toEqual([3, 4, 0]);
    expect(values(line, 'next_position').slice(12, 15)).toEqual([3, 8, 0]);
  });

  it('keeps its total length in _Length', () =>
  {
    const line = new Line(bent_points());

    expect(line.material.uniforms._Length.value).toBe(7);
    expect(line.total_length()).toBe(7);
    expect(line.distance()).toBe(7);
  });

  it('thickness reads and writes _Thickness', () =>
  {
    const line = new Line(bent_points());

    line.thickness = 3;

    expect(line.material.uniforms._Thickness.value).toBe(3);
    expect(line.thickness).toBe(3);
  });

  it('color sets _Color from any color value, and copy_color copies one', () =>
  {
    const line = new Line(bent_points());

    line.color = '#4080c0';

    expect(line.color).toEqual(new Color('#4080c0'));

    line.copy_color(new Color(0x00ff00));

    expect(line.material.uniforms._Color.value).toEqual(new Color(0x00ff00));
  });

  it('starts empty without points and builds its geometry on setup', () =>
  {
    const line = new Line();

    expect(line.geometry.getAttribute('position').count).toBe(0);
    expect(line.geometry.index).toBeNull();

    line.setup([new Vector3(0, 0, 0), new Vector3(1, 0, 0)]);

    expect(line.geometry.getAttribute('position').count).toBe(4);
    expect(line.geometry.index.count).toBe(6);
  });

  it('setup moves to a new geometry, and frees the old one, only when the point count changes', () =>
  {
    const line = new Line(bent_points());
    const first = line.geometry;
    let disposals = 0;
    first.addEventListener('dispose', () => disposals++);

    line.setup(bent_points().map(point => point.multiplyScalar(2)));

    expect(line.geometry).toBe(first);
    expect(disposals).toBe(0);

    line.setup([...bent_points(), new Vector3(0, 4, 0)]);

    expect(line.geometry).not.toBe(first);
    expect(disposals).toBe(1);
    expect(line.geometry.getAttribute('position').count).toBe(8);
    expect(line.geometry.index.count).toBe(18);
    expect(Object.keys(line.geometry.attributes).sort()).toEqual(['coverage', 'next_position', 'orientation', 'position', 'previous_position']);
  });

  it('keeps the same index while the point count stays', () =>
  {
    const line = new Line(bent_points());
    const index = line.geometry.index;

    line.setup(bent_points().map(point => point.multiplyScalar(2)));

    expect(line.geometry.index).toBe(index);
  });

  it('dispose fires its own dispose event, which WebGPURenderer listens to', () =>
  {
    const line = new Line(bent_points());
    let disposals = 0;
    line.addEventListener('dispose', () => disposals++);

    line.dispose();

    expect(disposals).toBe(1);
  });
});
