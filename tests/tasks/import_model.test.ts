import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';
// @ts-expect-error plain .mjs scaffolder script
import { plan_import_model } from '../../tasks/import_model/import_model.mjs';
import { EMPTY_OBJECTS, exists, make_project, read, write } from '../helpers/fixture_project';
import { make_glb } from '../helpers/glb';

let root: string;
let downloads: string;

beforeEach(() =>
{
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'ohzi-import-'));
  downloads = fs.mkdtempSync(path.join(os.tmpdir(), 'ohzi-downloads-'));
  make_project(root);
});

afterEach(() =>
{
  fs.rmSync(root, { recursive: true, force: true });
  fs.rmSync(downloads, { recursive: true, force: true });
});

function glb_file(file_name: string, json: unknown = { asset: { version: '2.0' } }): string
{
  const target = path.join(downloads, file_name);
  fs.writeFileSync(target, make_glb(json));

  return target;
}

function run(args: Record<string, unknown>, dry_run = false)
{
  const planned = plan_import_model(args, { root, dry_run });

  return { ...planned, report: planned.scaffolder.run() };
}

describe('plan_import_model', () =>
{
  it('copies the file, appends the manifest entry and describes the model', () =>
  {
    const source = glb_file('Office Chair.glb', { asset: { version: '2.0' }, extensionsUsed: ['KHR_draco_mesh_compression'] });
    const bytes = fs.readFileSync(source);

    const { model, unchanged, report } = run({ source });

    expect(unchanged).toBe(false);
    expect(report.applied).toBe(true);
    expect(model).toEqual({
      name: 'office_chair',
      url: '/models/office_chair.glb',
      draco: true,
      version: crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 12),
      size: bytes.length,
      tier: 'regular'
    });
    expect(fs.readFileSync(path.join(root, 'public/models/office_chair.glb')).equals(bytes)).toBe(true);
    expect(read(root, 'app/data/assets/home/home_objects.js')).toContain(`name: 'office_chair',\n    url: '/models/office_chair.glb',\n    size: ${bytes.length},\n    draco: true`);
  });

  it('uses the given name and the high tier', () =>
  {
    const { model } = run({ source: glb_file('x.glb'), name: 'tree', tier: 'high' });

    expect(model.url).toBe('/models/high/tree.glb');
    expect(exists(root, 'public/models/high/tree.glb')).toBe(true);
    expect(read(root, 'app/data/assets/home/high/home_high_objects.js')).toContain(`name: 'tree'`);
    expect(read(root, 'app/data/assets/home/home_objects.js')).not.toContain(`name: 'tree'`);
  });

  it('accepts an upper case .GLB extension', () =>
  {
    expect(run({ source: glb_file('CHAIR.GLB') }).model.name).toBe('chair');
  });

  it('dry run writes nothing', () =>
  {
    const { report } = run({ source: glb_file('chair.glb') }, true);

    expect(report.created).toEqual(['public/models/chair.glb']);
    expect(exists(root, 'public/models/chair.glb')).toBe(false);
  });

  it('is unchanged when the identical file is imported again', () =>
  {
    const source = glb_file('chair.glb');
    run({ source });

    const second = run({ source });

    expect(second.unchanged).toBe(true);
    expect(second.report.created).toEqual([]);
    expect(second.report.patched).toEqual([]);
  });

  it('refuses a changed file under the same name without replace', () =>
  {
    run({ source: glb_file('chair.glb') });
    const changed = glb_file('chair_v2.glb', { asset: { version: '2.0', generator: 'v2' } });

    expect(() => run({ source: changed, name: 'chair' })).toThrowError(/Pass replace/);
  });

  it('replaces a changed file and its size with replace, keeping one manifest entry', () =>
  {
    run({ source: glb_file('chair.glb') });
    const changed = glb_file('chair_v2.glb', { asset: { version: '2.0', generator: 'a much longer generator string' } });
    const bytes = fs.readFileSync(changed);

    const { report } = run({ source: changed, name: 'chair', replace: true });
    const manifest = read(root, 'app/data/assets/home/home_objects.js');

    expect(report.overwritten).toEqual(['public/models/chair.glb']);
    expect(manifest).toContain(`size: ${bytes.length},`);
    expect(manifest.match(/name: 'chair'/g)).toHaveLength(1);
  });

  it('keeps the manifest draco flag in sync when replace changes it', () =>
  {
    run({ source: glb_file('chair.glb') });
    const draco = glb_file('chair_draco.glb', { asset: { version: '2.0' }, extensionsUsed: ['KHR_draco_mesh_compression'] });

    const { model } = run({ source: draco, name: 'chair', replace: true });
    const manifest = read(root, 'app/data/assets/home/home_objects.js');

    expect(model.draco).toBe(true);
    expect(manifest).toMatch(/name: 'chair',[^}]*draco: true/);
    expect(manifest).not.toMatch(/name: 'chair',[^}]*draco: false/);
    expect(manifest.match(/name: 'chair'/g)).toHaveLength(1);
  });

  it('refuses a GLB on disk that the manifest does not list, unless replace', () =>
  {
    write(root, 'public/models/chair.glb', 'stray');

    expect(() => run({ source: glb_file('chair.glb') })).toThrowError(/not in app\/data\/assets\/home\/home_objects\.js/);
    expect(run({ source: glb_file('chair.glb'), replace: true }).report.overwritten).toEqual(['public/models/chair.glb']);
  });

  it('refuses a name already used in the other tier', () =>
  {
    run({ source: glb_file('chair.glb') });

    expect(() => run({ source: glb_file('chair.glb'), tier: 'high', replace: true })).toThrowError(/already in the regular manifest/);
  });

  it('refuses a URL that another entry already owns', () =>
  {
    write(root, 'app/data/assets/home/home_objects.js', `export const home_objects = [\n  {\n    name: 'stool',\n    url: '/models/chair.glb',\n    size: 1,\n    draco: false\n  }\n];\n`);

    expect(() => run({ source: glb_file('chair.glb'), replace: true })).toThrowError(/\/models\/chair\.glb already belongs to "stool" in scene "home"\. Pass a different name\./);
  });

  it('refuses a URL that an entry of another scene owns, replace or not', () =>
  {
    write(root, 'app/data/assets/about/about_objects.js', `export const about_objects = [\n  {\n    name: 'chair',\n    url: '/models/chair.glb',\n    size: 1,\n    draco: false\n  }\n];\n`);
    write(root, 'app/data/assets/about/high/about_high_objects.js', EMPTY_OBJECTS('about_high_objects'));
    write(root, 'public/models/chair.glb', 'stray');

    const message = '/models/chair.glb already belongs to "chair" in scene "about". Pass a different name.';

    expect(() => run({ source: glb_file('chair.glb') })).toThrowError(message);
    expect(() => run({ source: glb_file('chair.glb'), replace: true })).toThrowError(message);
  });

  it('refuses a URL owned in the high manifest of another scene, even when that scene has no regular manifest', () =>
  {
    write(root, 'app/data/assets/about/high/about_high_objects.js', `export const about_high_objects = [\n  {\n    name: 'tree',\n    url: '/models/high/tree.glb',\n    size: 1,\n    draco: false\n  }\n];\n`);

    expect(() => run({ source: glb_file('tree.glb'), tier: 'high', replace: true })).toThrowError(/already belongs to "tree" in scene "about"/);
  });

  it('refuses a model named like its scene', () =>
  {
    write(root, 'app/data/assets/gallery/gallery_objects.js', EMPTY_OBJECTS('gallery_objects'));
    write(root, 'app/data/assets/gallery/high/gallery_high_objects.js', EMPTY_OBJECTS('gallery_high_objects'));

    expect(() => run({ source: glb_file('gallery.glb'), scene: 'gallery' })).toThrowError(/"gallery" cannot be both the scene and the model name/);
    expect(exists(root, 'public/models/gallery.glb')).toBe(false);
  });

  it('refuses an entry of the same name that points elsewhere', () =>
  {
    write(root, 'app/data/assets/home/home_objects.js', `export const home_objects = [\n  {\n    name: 'chair',\n    url: '/models/old/chair.glb',\n    size: 1,\n    draco: false\n  }\n];\n`);

    expect(() => run({ source: glb_file('chair.glb') })).toThrowError(/points at \/models\/old\/chair\.glb/);
  });

  it('refuses a scene without an asset folder, suggesting create-scene', () =>
  {
    expect(() => run({ source: glb_file('chair.glb'), scene: 'gallery' })).toThrowError(/yarn create-scene gallery/);
  });

  it('refuses a source that is missing, not a .glb, or not a GLB inside', () =>
  {
    expect(() => run({ source: path.join(downloads, 'nope.glb') })).toThrowError(/no file at/);
    expect(() => run({ source: glb_file('chair.gltf') })).toThrowError(/only self-contained \.glb/);

    const fake = path.join(downloads, 'fake.glb');
    fs.writeFileSync(fake, 'this is not a model, just text');
    expect(() => run({ source: fake })).toThrowError(/not a GLB file/);
  });

  it('refuses a GLB that requires meshopt', () =>
  {
    const source = glb_file('chair.glb', { asset: { version: '2.0' }, extensionsRequired: ['EXT_meshopt_compression'] });

    expect(() => run({ source })).toThrowError(/EXT_meshopt_compression/);
  });

  it('refuses a bad tier', () =>
  {
    expect(() => run({ source: glb_file('chair.glb'), tier: 'medium' })).toThrowError(/tier must be/);
  });
});
