import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
// @ts-expect-error plain .mjs scaffolder script
import { plan_view } from '../../tasks/create_view/create_view.mjs';

let root: string;

// Mirrors the anchors the real boilerplate provides.
const FIXTURE: Record<string, string> = {
  'index.pug': 'html\n  body\n      __SECTIONS__\n',
  'app/css/application.scss': "@import 'base';\n__SECTIONS__\n",
  'app/data/default_state_data.js': 'const default_state_data = {\n  loader_opacity: 0,\n};\n',
  'app/js/views/Sections.ts': "const Sections = {\n  INITIAL: 'initial',\n};\n\nconst SectionsURLs = {\n  INITIAL: '/initial',\n};\n",
  'app/js/MainApplication.ts': [
    "import { HomeView } from './views/home/HomeView';",
    '',
    'export class MainApplication extends BaseApplication',
    '{',
    '  home_view: HomeView;',
    '',
    '  on_enter()',
    '  {',
    '    this.home_view = new HomeView();',
    '    this.home_view.start();',
    '  }',
    '}',
    ''
  ].join('\n')
};

function write(relative: string, contents: string)
{
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents, 'utf8');
}

function read(relative: string): string
{
  return fs.readFileSync(path.join(root, relative), 'utf8');
}

function exists(relative: string): boolean
{
  return fs.existsSync(path.join(root, relative));
}

beforeEach(() =>
{
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'ohzi-view-'));

  for (const [relative, contents] of Object.entries(FIXTURE))
  {
    write(relative, contents);
  }
});

afterEach(() =>
{
  fs.rmSync(root, { recursive: true, force: true });
});

describe('create_view files', () =>
{
  it('creates the three controllers, transition data, template and styles', () =>
  {
    const report = plan_view('gallery', { root }).run();

    expect(report.applied).toBe(true);
    expect(exists('app/js/views/gallery/GalleryView.ts')).toBe(true);
    expect(exists('app/js/views/gallery/GallerySceneController.ts')).toBe(true);
    expect(exists('app/js/views/gallery/GalleryTransitionController.ts')).toBe(true);
    expect(exists('app/data/transitions/gallery.json')).toBe(true);
    expect(exists('app/views/gallery/gallery.pug')).toBe(true);
    expect(exists('app/css/gallery/_gallery.scss')).toBe(true);
  });

  it('substitutes every placeholder in the view class', () =>
  {
    plan_view('gallery', { root }).run();

    const view = read('app/js/views/gallery/GalleryView.ts');

    expect(view).toContain('export class GalleryView extends CommonView');
    expect(view).toContain('Sections.GALLERY');
    expect(view).toContain("document.querySelector('.gallery')");
    expect(view).toContain("import gallery_data from '../../../data/transitions/gallery.json'");
    expect(view).not.toContain('Template');
    expect(view).not.toContain('template');
  });

  it('converts a multi word name to the right casing everywhere', () =>
  {
    plan_view('My Cool-View', { root }).run();

    expect(exists('app/js/views/my_cool_view/MyCoolViewView.ts')).toBe(true);
    expect(read('app/js/views/Sections.ts')).toContain("MY_COOL_VIEW: 'my_cool_view',");
    expect(read('app/js/views/Sections.ts')).toContain("MY_COOL_VIEW: '/my-cool-view',");
    expect(read('app/css/my_cool_view/_my_cool_view.scss')).toContain('.my-cool-view');
  });

  it('renames the opacity attribute in the transition data', () =>
  {
    plan_view('gallery', { root }).run();

    expect(read('app/data/transitions/gallery.json')).toContain('"gallery_opacity"');
  });
});

describe('create_view wiring', () =>
{
  it('wires the view into every registration point', () =>
  {
    plan_view('gallery', { root }).run();

    expect(read('app/data/default_state_data.js')).toContain('gallery_opacity: 0,');
    expect(read('app/css/application.scss')).toContain("@import 'gallery/gallery';");
    expect(read('index.pug')).toContain('include app/views/gallery/gallery');

    const main = read('app/js/MainApplication.ts');
    expect(main).toContain("import { GalleryView } from './views/gallery/GalleryView';");
    expect(main).toContain('gallery_view: GalleryView;');
    expect(main).toContain('this.gallery_view = new GalleryView();');
    expect(main).toContain('this.gallery_view.start();');
  });
});

describe('create_view safety', () =>
{
  it('refuses a second run and changes nothing', () =>
  {
    expect(plan_view('gallery', { root }).run().applied).toBe(true);

    const before = read('app/js/MainApplication.ts');
    const second = plan_view('gallery', { root }).run();

    expect(second.applied).toBe(false);
    expect(second.errors.length).toBeGreaterThan(0);
    expect(read('app/js/MainApplication.ts')).toBe(before);
  });

  it('does not duplicate any import on a repeated run', () =>
  {
    plan_view('gallery', { root }).run();
    plan_view('gallery', { root }).run();

    const main = read('app/js/MainApplication.ts');

    expect(main.match(/import \{ GalleryView \}/g)).toHaveLength(1);
  });

  it('refuses when an anchor is missing rather than half wiring the view', () =>
  {
    write('app/js/MainApplication.ts', 'export class MainApplication {}\n');

    const report = plan_view('gallery', { root }).run();

    expect(report.applied).toBe(false);
    expect(report.errors.join(' ')).toContain('anchor not found');
    // Nothing at all was written, not even the files that would have been valid.
    expect(exists('app/js/views/gallery/GalleryView.ts')).toBe(false);
    expect(read('app/css/application.scss')).not.toContain('gallery');
  });

  it('dry run reports the full plan and writes nothing', () =>
  {
    const report = plan_view('gallery', { root, dry_run: true }).run();

    expect(report.errors).toHaveLength(0);
    expect(report.created).toHaveLength(6);
    expect(report.patched).toHaveLength(9);
    expect(exists('app/js/views/gallery/GalleryView.ts')).toBe(false);
    expect(read('app/js/MainApplication.ts')).toBe(FIXTURE['app/js/MainApplication.ts']);
  });

  it('rejects an empty name', () =>
  {
    expect(() => plan_view('', { root })).toThrowError(/name is required/);
    expect(() => plan_view('!!!', { root })).toThrowError(/name is required/);
  });
});
