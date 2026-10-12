import { describe, expect, it } from 'vitest';
// @ts-expect-error plain .mjs scaffolder script
import { assert_supported, read_glb_header } from '../../tasks/import_model/glb_header.mjs';
import { make_glb } from '../helpers/glb';

const ASSET = { asset: { version: '2.0' } };

describe('read_glb_header', () =>
{
  it('reads a plain GLB as not draco with no extensions', () =>
  {
    expect(read_glb_header(make_glb(ASSET))).toEqual({ draco: false, extensions_used: [], extensions_required: [] });
  });

  it('detects draco from extensionsUsed', () =>
  {
    const header = read_glb_header(make_glb({ ...ASSET, extensionsUsed: ['KHR_draco_mesh_compression'] }));

    expect(header.draco).toBe(true);
  });

  it('rejects a file that is shorter than a GLB header', () =>
  {
    expect(() => read_glb_header(Buffer.from('glTF'))).toThrowError(/shorter than a GLB header/);
  });

  it('rejects a file without the glTF magic number', () =>
  {
    expect(() => read_glb_header(make_glb(ASSET, { magic: 0x12345678 }))).toThrowError(/not a GLB file/);
  });

  it('rejects glTF 1.0', () =>
  {
    expect(() => read_glb_header(make_glb(ASSET, { version: 1 }))).toThrowError(/unsupported GLB version 1/);
  });

  it('rejects a first chunk that is not JSON', () =>
  {
    expect(() => read_glb_header(make_glb(ASSET, { chunk_type: 0x004e4942 }))).toThrowError(/first chunk is not JSON/);
  });

  it('rejects a JSON chunk that does not parse', () =>
  {
    const glb = make_glb(ASSET);
    glb.write('{', 20);
    glb.write('{', 21);

    expect(() => read_glb_header(glb)).toThrowError(/does not parse/);
  });

  it('rejects a JSON chunk that is not an object', () =>
  {
    expect(() => read_glb_header(make_glb(null))).toThrowError(/does not parse/);
  });

  it('rejects a truncated JSON chunk', () =>
  {
    const glb = make_glb(ASSET);

    expect(() => read_glb_header(glb.subarray(0, 24))).toThrowError(/truncated/);
  });
});

describe('assert_supported', () =>
{
  it('accepts draco', () =>
  {
    const header = read_glb_header(make_glb({ ...ASSET, extensionsUsed: ['KHR_draco_mesh_compression'], extensionsRequired: ['KHR_draco_mesh_compression'] }));

    expect(() => assert_supported(header)).not.toThrow();
  });

  it('refuses meshopt and KTX2 when required, naming them', () =>
  {
    const header = read_glb_header(make_glb({ ...ASSET, extensionsRequired: ['EXT_meshopt_compression', 'KHR_texture_basisu'] }));

    expect(() => assert_supported(header)).toThrowError(/EXT_meshopt_compression, KHR_texture_basisu/);
  });

  it('accepts an unsupported extension that is only used, not required', () =>
  {
    const header = read_glb_header(make_glb({ ...ASSET, extensionsUsed: ['KHR_texture_basisu'] }));

    expect(() => assert_supported(header)).not.toThrow();
  });
});
