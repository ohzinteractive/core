import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
// @ts-expect-error plain .mjs scaffolder script
import { plan_commit_object } from '../../tasks/import_model/import_model.mjs';
import { exists, make_project, read, SCENE, write } from '../helpers/fixture_project';

let root: string;

const PLACED = { position: [1.25, 0, -2], rotation: [0, 1.5708, 0], scale: [1, 1, 1] };

const CHAIR_CLASS = `import { ResourceContainer } from 'ohzi-core';
import { Object3D } from 'three';

export class Chair extends Object3D
{
  constructor()
  {
    super();

    this.name = 'chair';
    this.add(ResourceContainer.get('chair').scene);

    this.position.set(1.25, 0, -2);
    this.rotation.set(0, 1.5708, 0);
    this.scale.set(1, 1, 1);
  }
}
`;

function list(name: string, tier: 'regular' | 'high' = 'regular')
{
  const relative = tier === 'high' ? 'app/data/assets/home/high/home_high_objects.js' : 'app/data/assets/home/home_objects.js';
  const variable = tier === 'high' ? 'home_high_objects' : 'home_objects';
  const url = tier === 'high' ? `/models/high/${name}.glb` : `/models/${name}.glb`;

  write(root, relative, `export const ${variable} = [\n  {\n    name: '${name}',\n    url: '${url}',\n    size: 1,\n    draco: false\n  }\n];\n`);
}

function commit(args: Record<string, unknown>, dry_run = false)
{
  return plan_commit_object({ transform: PLACED, ...args }, { root, dry_run }).run();
}

beforeEach(() =>
{
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'ohzi-commit-'));
  make_project(root);
});

afterEach(() => { fs.rmSync(root, { recursive: true, force: true }); });

describe('plan_commit_object, first commit', () =>
{
  it('creates the wrapper class from the template', () =>
  {
    list('chair');

    const report = commit({ name: 'chair' });

    expect(report.applied).toBe(true);
    expect(report.created).toEqual(['app/js/objects/Chair.ts']);
    expect(read(root, 'app/js/objects/Chair.ts')).toBe(CHAIR_CLASS);
  });

  it('wires the scene above each marker', () =>
  {
    list('chair');

    commit({ name: 'chair' });
    const scene = read(root, 'app/js/scenes/HomeScene.ts');

    expect(scene).toContain(`import { Grid, PerspectiveCamera } from 'ohzi-core';\nimport { Chair } from '../objects/Chair';\n// __OBJECT_IMPORTS__`);
    expect(scene).toContain(`  camera: PerspectiveCamera;\n  chair: Chair;\n  // __OBJECT_FIELDS__`);
    expect(scene).toContain(`    super.on_assets_ready();\n\n    this.chair = new Chair();\n    this.add(this.chair);\n\n    // __OBJECTS__`);
  });

  it('wires a high tier model in on_high_quality_assets_ready', () =>
  {
    list('tree', 'high');

    commit({ name: 'tree' });
    const scene = read(root, 'app/js/scenes/HomeScene.ts');

    expect(scene).toContain(`    this.tree = new Tree();\n    this.add(this.tree);\n\n    // __HIGH_OBJECTS__`);
    expect(scene).not.toContain(`this.tree = new Tree();\n    this.add(this.tree);\n\n    // __OBJECTS__`);
  });

  it('keeps insertion order across models', () =>
  {
    list('chair');
    commit({ name: 'chair' });
    write(root, 'app/data/assets/home/home_objects.js', read(root, 'app/data/assets/home/home_objects.js').replace('];', `  ,{\n    name: 'table',\n    url: '/models/table.glb',\n    size: 1,\n    draco: false\n  }\n];`));

    commit({ name: 'table' });
    const scene = read(root, 'app/js/scenes/HomeScene.ts');

    expect(scene.indexOf('this.chair = new Chair();')).toBeLessThan(scene.indexOf('this.table = new Table();'));
  });

  it('dry run writes nothing', () =>
  {
    list('chair');

    const report = commit({ name: 'chair' }, true);

    expect(report.created).toEqual(['app/js/objects/Chair.ts']);
    expect(exists(root, 'app/js/objects/Chair.ts')).toBe(false);
    expect(read(root, 'app/js/scenes/HomeScene.ts')).toBe(SCENE);
  });
});

describe('plan_commit_object, committing again', () =>
{
  beforeEach(() =>
  {
    list('chair');
    commit({ name: 'chair' });
  });

  it('rewrites only the transform lines and leaves the scene alone', () =>
  {
    const scene_before = read(root, 'app/js/scenes/HomeScene.ts');

    const report = commit({ name: 'chair', transform: { position: [3, 1, 0], rotation: [0, 0, 0], scale: [2, 2, 2] } });
    const chair = read(root, 'app/js/objects/Chair.ts');

    expect(report.applied).toBe(true);
    expect(chair).toContain('    this.position.set(3, 1, 0);\n    this.rotation.set(0, 0, 0);\n    this.scale.set(2, 2, 2);');
    expect(read(root, 'app/js/scenes/HomeScene.ts')).toBe(scene_before);
    expect(report.skipped.map((entry: { label: string }) => entry.label)).toEqual(expect.arrayContaining(['import of Chair', 'field chair', 'instance of Chair']));
  });

  it('preserves code a developer added to the class', () =>
  {
    write(root, 'app/js/objects/Chair.ts', read(root, 'app/js/objects/Chair.ts').replace('  }\n}\n', '  }\n\n  update()\n  {\n    this.rotation.y += 0.01;\n  }\n}\n'));

    commit({ name: 'chair', transform: { position: [9, 9, 9], rotation: [0, 0, 0], scale: [1, 1, 1] } });

    expect(read(root, 'app/js/objects/Chair.ts')).toContain('this.rotation.y += 0.01;');
    expect(read(root, 'app/js/objects/Chair.ts')).toContain('this.position.set(9, 9, 9);');
  });

  it('refuses a class with a duplicated or missing transform line', () =>
  {
    const original = read(root, 'app/js/objects/Chair.ts');

    write(root, 'app/js/objects/Chair.ts', original.replace('    this.scale.set(1, 1, 1);\n', '    this.scale.set(1, 1, 1);\n    this.scale.set(2, 2, 2);\n'));
    expect(() => commit({ name: 'chair' })).toThrowError(/has 2 "this\.scale\.set\(\.\.\.\)" lines/);

    write(root, 'app/js/objects/Chair.ts', original.replace('    this.position.set(1.25, 0, -2);\n', ''));
    expect(() => commit({ name: 'chair' })).toThrowError(/has 0 "this\.position\.set\(\.\.\.\)" lines/);
  });
});

describe('plan_commit_object, refusals', () =>
{
  it('refuses a model that no manifest lists', () =>
  {
    expect(() => commit({ name: 'chair' })).toThrowError(/Import it first/);
  });

  it('refuses a scene that lacks a marker, naming it and where it goes', () =>
  {
    list('chair');
    write(root, 'app/js/scenes/HomeScene.ts', SCENE.replace('  // __OBJECT_FIELDS__\n', ''));

    expect(() => commit({ name: 'chair' })).toThrowError(/__OBJECT_FIELDS__ \(in the class field list\)/);
  });

  it('refuses a name that is already a scene member', () =>
  {
    list('camera');

    expect(() => commit({ name: 'camera' })).toThrowError(/already has a member called camera/);
  });

  it('refuses a name that AbstractScene already declares', () =>
  {
    list('update');
    write(root, 'core/src/scenes/AbstractScene.ts', 'export class AbstractScene\n{\n  update()\n  {\n  }\n}\n');

    expect(() => commit({ name: 'update' })).toThrowError(/already has a member called update/);
  });

  it('refuses a name whose class is already an identifier in the scene', () =>
  {
    list('grid');

    expect(() => commit({ name: 'grid' })).toThrowError(/already uses the identifier Grid/);
  });

  it('refuses an existing class file that wraps a different model', () =>
  {
    list('chair');
    write(root, 'app/js/objects/Chair.ts', CHAIR_CLASS.replace(/'chair'/g, `'chair2'`));

    expect(() => commit({ name: 'chair' })).toThrowError(/wraps a different model/);
  });
});

describe('plan_commit_object, numbers', () =>
{
  it('rounds to 4 decimals and writes -0 and tiny values as 0', () =>
  {
    list('chair');

    commit({ name: 'chair', transform: { position: [-0, 1e-7, 3.14159265], rotation: [-0.00001, 0, 0], scale: [1, 1, 1] } });
    const chair = read(root, 'app/js/objects/Chair.ts');

    expect(chair).toContain('this.position.set(0, 0, 3.1416);');
    expect(chair).toContain('this.rotation.set(0, 0, 0);');
  });

  it('refuses NaN, Infinity and vectors that are not three numbers', () =>
  {
    list('chair');

    expect(() => commit({ name: 'chair', transform: { ...PLACED, position: [NaN, 0, 0] } })).toThrowError(/finite numbers/);
    expect(() => commit({ name: 'chair', transform: { ...PLACED, scale: [Infinity, 1, 1] } })).toThrowError(/finite numbers/);
    expect(() => commit({ name: 'chair', transform: { ...PLACED, rotation: [0, 0] } })).toThrowError(/rotation must be \[x, y, z\]/);
  });
});
