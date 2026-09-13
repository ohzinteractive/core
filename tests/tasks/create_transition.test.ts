import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
// @ts-expect-error plain .mjs scaffolder script
import { plan_transition } from '../../tasks/create_transition/create_transition.mjs';

let root: string;

const CONTROLLER = 'app/js/views/gallery/GalleryTransitionController.ts';

const CONTROLLER_SOURCE = [
  "// import { TransitionManager } from 'ohzi-core';",
  "// import { Sections } from '../Sections';",
  "import { CommonTransitionController } from '../common/CommonTransitionController';",
  '',
  'export class GalleryTransitionController extends CommonTransitionController',
  '{',
  '  start()',
  '  {',
  '    super.start();',
  '',
  '    // __CUSTOM_TRANSITIONS__',
  '  }',
  '}',
  ''
].join('\n');

function write(relative: string, contents: string)
{
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents, 'utf8');
}

const read = (r: string) => fs.readFileSync(path.join(root, r), 'utf8');
const exists = (r: string) => fs.existsSync(path.join(root, r));

beforeEach(() =>
{
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'ohzi-transition-'));
  write(CONTROLLER, CONTROLLER_SOURCE);
});

afterEach(() => { fs.rmSync(root, { recursive: true, force: true }); });

describe('create_transition', () =>
{
  it('creates the transition data and wires the controller', () =>
  {
    const report = plan_transition('home', 'gallery', { root }).run();

    expect(report.applied).toBe(true);
    expect(exists('app/data/custom_transitions/home_to_gallery.json')).toBe(true);

    const controller = read(CONTROLLER);

    expect(controller).toContain("import { TransitionManager } from 'ohzi-core';");
    expect(controller).not.toContain("// import { TransitionManager }");
    expect(controller).toContain("import home_to_gallery from '../../../data/custom_transitions/home_to_gallery.json';");
    expect(controller).toContain('from: Sections.HOME,');
    expect(controller).toContain('to: Sections.GALLERY,');
  });

  it('keeps the marker so further transitions can be added', () =>
  {
    plan_transition('home', 'gallery', { root }).run();

    expect(read(CONTROLLER)).toContain('// __CUSTOM_TRANSITIONS__');
  });

  it('adds a second transition into the same view, skipping the already uncommented imports', () =>
  {
    plan_transition('home', 'gallery', { root }).run();

    const second = plan_transition('transition', 'gallery', { root }).run();

    expect(second.applied).toBe(true);
    expect(second.skipped.map((s: { label: string }) => s.label)).toEqual([
      'uncomment TransitionManager import',
      'uncomment Sections import'
    ]);

    const controller = read(CONTROLLER);

    expect(controller.match(/import \{ TransitionManager \}/g)).toHaveLength(1);
    expect(controller).toContain('from: Sections.TRANSITION,');
    expect(controller).toContain('from: Sections.HOME,');
  });

  it('refuses the exact same transition twice', () =>
  {
    plan_transition('home', 'gallery', { root }).run();

    const second = plan_transition('home', 'gallery', { root }).run();

    expect(second.applied).toBe(false);
    expect(second.errors.join(' ')).toContain('already exists');
  });

  it('refuses when the destination view does not exist', () =>
  {
    expect(() => plan_transition('home', 'ghost', { root })).toThrowError(/No view named 'ghost'/);
  });

  it('refuses a transition from a view to itself', () =>
  {
    expect(() => plan_transition('gallery', 'gallery', { root })).toThrowError(/two different views/);
  });

  it('requires both names', () =>
  {
    expect(() => plan_transition('home', undefined, { root })).toThrowError(/Two view names are required/);
  });

  it('dry run writes nothing', () =>
  {
    plan_transition('home', 'gallery', { root, dry_run: true }).run();

    expect(exists('app/data/custom_transitions/home_to_gallery.json')).toBe(false);
    expect(read(CONTROLLER)).toBe(CONTROLLER_SOURCE);
  });
});
