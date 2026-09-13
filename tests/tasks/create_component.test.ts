import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
// @ts-expect-error plain .mjs scaffolder script
import { plan_component } from '../../tasks/create_component/create_component.mjs';

let root: string;

const MAIN = [
  "import { HomeView } from './views/home/HomeView';",
  '',
  'export class MainApplication extends BaseApplication',
  '{',
  '  home_view: HomeView;',
  '',
  '  on_enter()',
  '  {',
  '    // __COMPONENTS__',
  '  }',
  '}',
  ''
].join('\n');

const FIXTURE: Record<string, string> = {
  'index.pug': 'html\n  body\n      __COMPONENTS__\n',
  'app/css/application.scss': '__COMPONENTS__\n',
  'app/data/default_state_data.js': 'const d = {\n  loader_opacity: 0,\n};\n',
  'app/js/MainApplication.ts': MAIN,
  'app/js/view_components/Components.ts': 'const Components = {\n  __COMPONENTS__\n};\n'
};

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
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'ohzi-component-'));

  for (const [relative, contents] of Object.entries(FIXTURE))
  {
    write(relative, contents);
  }
});

afterEach(() => { fs.rmSync(root, { recursive: true, force: true }); });

describe('create_component', () =>
{
  it('creates the class, template and styles', () =>
  {
    const report = plan_component('header', { root }).run();

    expect(report.applied).toBe(true);
    expect(exists('app/js/view_components/header/HeaderComponent.ts')).toBe(true);
    expect(exists('app/views/components/header/header.pug')).toBe(true);
    expect(exists('app/css/components/header/_header.scss')).toBe(true);
  });

  it('wires the component into every registration point', () =>
  {
    plan_component('header', { root }).run();

    const main = read('app/js/MainApplication.ts');

    expect(main).toContain("import { HeaderComponent } from './view_components/header/HeaderComponent';");
    expect(main).toContain('header_component: HeaderComponent;');
    expect(main).toContain('this.header_component = new HeaderComponent();');
    expect(main).toContain('this.header_component.start();');

    expect(read('app/js/view_components/Components.ts')).toContain("HEADER: 'header',");
    expect(read('app/css/application.scss')).toContain("@import 'components/header/header';");
    expect(read('index.pug')).toContain('include app/views/components/header/header');
    expect(read('app/data/default_state_data.js')).toContain('header_opacity: 0,');
  });

  it('applies the start patch that depends on the instantiation patch', () =>
  {
    plan_component('header', { root }).run();

    const main = read('app/js/MainApplication.ts');
    const instantiation = main.indexOf('this.header_component = new HeaderComponent();');
    const start = main.indexOf('this.header_component.start();');

    expect(instantiation).toBeGreaterThan(-1);
    expect(start).toBeGreaterThan(instantiation);
  });

  it('refuses a second run and changes nothing', () =>
  {
    plan_component('header', { root }).run();

    const before = read('app/js/MainApplication.ts');
    const second = plan_component('header', { root }).run();

    expect(second.applied).toBe(false);
    expect(read('app/js/MainApplication.ts')).toBe(before);
  });

  it('allows a second, different component', () =>
  {
    plan_component('header', { root }).run();

    expect(plan_component('footer', { root }).run().applied).toBe(true);

    const main = read('app/js/MainApplication.ts');

    expect(main).toContain('this.header_component.start();');
    expect(main).toContain('this.footer_component.start();');
  });

  it('refuses when an anchor is missing rather than half wiring', () =>
  {
    write('app/js/view_components/Components.ts', 'const Components = {};\n');

    const report = plan_component('header', { root }).run();

    expect(report.applied).toBe(false);
    expect(exists('app/js/view_components/header/HeaderComponent.ts')).toBe(false);
    expect(read('app/js/MainApplication.ts')).toBe(MAIN);
  });

  it('dry run writes nothing', () =>
  {
    const report = plan_component('header', { root, dry_run: true }).run();

    expect(report.errors).toHaveLength(0);
    expect(report.created).toHaveLength(3);
    expect(report.patched).toHaveLength(8);
    expect(read('app/js/MainApplication.ts')).toBe(MAIN);
  });
});
