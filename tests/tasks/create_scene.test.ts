import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
// @ts-expect-error plain .mjs scaffolder script
import { plan_scene } from '../../tasks/create_scene/create_scene.mjs';

let root: string;

beforeEach(() => { root = fs.mkdtempSync(path.join(os.tmpdir(), 'ohzi-scene-')); });
afterEach(() => { fs.rmSync(root, { recursive: true, force: true }); });

const exists = (r: string) => fs.existsSync(path.join(root, r));
const read = (r: string) => fs.readFileSync(path.join(root, r), 'utf8');

describe('create_scene', () =>
{
  it('creates the scene class and both asset tiers', () =>
  {
    const report = plan_scene('gallery', { root }).run();

    expect(report.applied).toBe(true);
    expect(exists('app/js/scenes/GalleryScene.ts')).toBe(true);

    for (const kind of ['objects', 'sounds', 'textures'])
    {
      expect(exists(`app/data/assets/gallery/gallery_${kind}.js`), kind).toBe(true);
      expect(exists(`app/data/assets/gallery/high/gallery_high_${kind}.js`), `high ${kind}`).toBe(true);
    }
  });

  it('substitutes the scene name into the class', () =>
  {
    plan_scene('gallery', { root }).run();

    const scene = read('app/js/scenes/GalleryScene.ts');

    expect(scene).toContain('GalleryScene');
    expect(scene).not.toContain('Template');
  });

  it('registers nothing, because a scene has no wiring', () =>
  {
    expect(plan_scene('gallery', { root }).run().patched).toHaveLength(0);
  });

  it('refuses a second run rather than overwriting the scene', () =>
  {
    plan_scene('gallery', { root }).run();

    const second = plan_scene('gallery', { root }).run();

    expect(second.applied).toBe(false);
    expect(second.errors.join(' ')).toContain('already exists');
  });

  it('dry run writes nothing', () =>
  {
    const report = plan_scene('gallery', { root, dry_run: true }).run();

    expect(report.created).toHaveLength(7);
    expect(exists('app/js/scenes/GalleryScene.ts')).toBe(false);
  });

  it('rejects an empty name', () =>
  {
    expect(() => plan_scene('', { root })).toThrowError(/name is required/);
  });
});
