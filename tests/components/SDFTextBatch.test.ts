import { describe, expect, it } from 'vitest';

import { Color, DataTexture, Vector2, Vector3 } from 'three';

import { SDFTextBatch } from '../../src/components/sdf_text/SDFTextBatch';
import { SDFTextMaterial } from '../../src/materials/SDFTextMaterial';

const GLYPH_ATTRIBUTES = ['transformsCol0', 'transformsCol1', 'transformsCol2', 'transformsCol3', 'glyph_bounds', 'plane_bounds', 'color'];

// One glyph, 'A', that fills a 1x1 em box and the left half of a 16x8 atlas.
const FONT_LAYOUT = {
  atlas: { width: 16, height: 8 },
  glyphs: [
    { unicode: 65, advance: 1, planeBounds: { left: 0, bottom: 0, right: 1, top: 1 }, atlasBounds: { left: 0, bottom: 0, right: 8, top: 8 } }
  ]
};

function create_batch(): SDFTextBatch
{
  return new SDFTextBatch(FONT_LAYOUT, new DataTexture(new Uint8Array(4), 1, 1));
}

// The four floats of a per glyph attribute for one instance.
function instance_values(batch: SDFTextBatch, name: string, instance: number): number[]
{
  const attribute = batch.geometry.getAttribute(name);

  return [attribute.getX(instance), attribute.getY(instance), attribute.getZ(instance), attribute.getW(instance)];
}

function glyph_buffer(batch: SDFTextBatch)
{
  return (batch.geometry.getAttribute('glyph_bounds') as unknown as { data: { version: number } }).data;
}

describe('SDFTextBatch', () =>
{
  it('draws with an SDFTextMaterial sized to the atlas', () =>
  {
    const batch = create_batch();

    expect(batch.material).toBeInstanceOf(SDFTextMaterial);
    expect(batch.material.uniforms._AtlasSize.value).toEqual(new Vector2(16, 8));
  });

  it('keeps every per glyph attribute in one instance buffer, within the 8 vertex buffers WebGPU allows', () =>
  {
    const batch = create_batch();
    const attributes = Object.values(batch.geometry.attributes);
    const first = batch.geometry.getAttribute('transformsCol0') as unknown as { data: unknown };

    for (const name of GLYPH_ATTRIBUTES)
    {
      const attribute = batch.geometry.getAttribute(name) as unknown as { isInterleavedBufferAttribute: boolean, itemSize: number, data: { isInstancedInterleavedBuffer: boolean } };

      expect(attribute.isInterleavedBufferAttribute, name).toBe(true);
      expect(attribute.itemSize, name).toBe(4);
      expect(attribute.data, name).toBe(first.data);
      expect(attribute.data.isInstancedInterleavedBuffer, name).toBe(true);
    }

    const buffers = new Set(attributes.map(attribute => ('data' in attribute ? attribute.data : attribute)));

    expect(buffers.size).toBe(3);
  });

  it('writes one instance per glyph, with the matrix, bounds and color of its text', () =>
  {
    const batch = create_batch();
    batch.add_text('A');
    const text = batch.add_text('AA');
    text.set_position(new Vector3(1, 2, 3));
    text.set_size(16);
    text.set_color(new Color(0.25, 0.5, 0.75));
    text.opacity = 0.5;

    batch.update(false);

    expect(batch.geometry.instanceCount).toBe(3);
    // The second glyph of 'AA', one em right of the first, both centered on the text.
    expect(instance_values(batch, 'plane_bounds', 2)).toEqual([0, -0.5, 1, 1]);
    expect(instance_values(batch, 'glyph_bounds', 2)).toEqual([0, 8, 8, 0]);
    expect(instance_values(batch, 'transformsCol0', 2)).toEqual([16, 0, 0, 0]);
    expect(instance_values(batch, 'transformsCol3', 2)).toEqual([1, 2, 3, 1]);
    expect(instance_values(batch, 'color', 2)).toEqual([0.25, 0.5, 0.75, 0.5]);
    // The first text keeps the identity matrix and opaque white.
    expect(instance_values(batch, 'transformsCol3', 0)).toEqual([0, 0, 0, 1]);
    expect(instance_values(batch, 'color', 0)).toEqual([1, 1, 1, 1]);
  });

  it('uploads the instance buffer only when a text changed or the update is forced', () =>
  {
    const batch = create_batch();
    const text = batch.add_text('A');

    batch.update(false);
    const version = glyph_buffer(batch).version;

    batch.update(false);
    expect(glyph_buffer(batch).version).toBe(version);

    text.set_color(new Color(0xff0000));
    batch.update(false);
    expect(glyph_buffer(batch).version).toBeGreaterThan(version);

    const forced = glyph_buffer(batch).version;
    batch.update(true);
    expect(glyph_buffer(batch).version).toBeGreaterThan(forced);
  });

  it('drops the glyphs of a removed text', () =>
  {
    const batch = create_batch();
    const text = batch.add_text('AA');
    batch.update(false);

    batch.remove_text(text);

    expect(batch.geometry.instanceCount).toBe(0);
  });
});
