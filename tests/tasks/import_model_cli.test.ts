import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
// @ts-expect-error plain .mjs scaffolder script
import { main } from '../../tasks/import_model/import_model.mjs';
import { exists, make_project, read } from '../helpers/fixture_project';
import { make_glb } from '../helpers/glb';

let root: string;

beforeEach(() =>
{
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'ohzi-cli-'));
  make_project(root);
  fs.mkdirSync(path.join(root, 'core'));
  fs.mkdirSync(path.join(root, 'downloads'));
  fs.writeFileSync(path.join(root, 'downloads/chair.glb'), make_glb({ asset: { version: '2.0' } }));
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() =>
{
  vi.restoreAllMocks();
  fs.rmSync(root, { recursive: true, force: true });
});

const core_dir = () => path.join(root, 'core');

describe('import-model CLI', () =>
{
  it('resolves a relative source against INIT_CWD, not core/', () =>
  {
    const code = main(['node', 'import_model.mjs', 'downloads/chair.glb'], { cwd: core_dir(), env: { INIT_CWD: root } });

    expect(code).toBe(0);
    expect(exists(root, 'public/models/chair.glb')).toBe(true);
  });

  it('passes --name, --tier and --scene through', () =>
  {
    main(['node', 'import_model.mjs', 'downloads/chair.glb', '--name', 'stool', '--tier', 'high', '--scene', 'home'], { cwd: core_dir(), env: { INIT_CWD: root } });

    expect(read(root, 'app/data/assets/home/high/home_high_objects.js')).toContain(`name: 'stool'`);
  });

  it('dry run writes nothing', () =>
  {
    main(['node', 'import_model.mjs', 'downloads/chair.glb', '--dry-run'], { cwd: core_dir(), env: { INIT_CWD: root } });

    expect(exists(root, 'public/models/chair.glb')).toBe(false);
  });

  it('exits 1 with usage when no source is given', () =>
  {
    expect(main(['node', 'import_model.mjs'], { cwd: core_dir(), env: {} })).toBe(1);
  });

  it('exits 1 on a refusal', () =>
  {
    expect(main(['node', 'import_model.mjs', 'downloads/missing.glb'], { cwd: core_dir(), env: { INIT_CWD: root } })).toBe(1);
  });
});
