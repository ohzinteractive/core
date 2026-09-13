import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
// @ts-expect-error plain .mjs helper shared by the scaffolder scripts
import { Scaffolder, capitalize, sanitize_name } from '../../tasks/_shared/scaffolding.mjs';

let root: string;

beforeEach(() =>
{
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'ohzi-scaffold-'));
});

afterEach(() =>
{
  fs.rmSync(root, { recursive: true, force: true });
});

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

describe('sanitize_name', () =>
{
  it('normalises separators and case', () =>
  {
    expect(sanitize_name('My Cool-View')).toBe('my_cool_view');
  });

  it('strips characters that cannot appear in an identifier or path', () =>
  {
    expect(sanitize_name('we!rd/name')).toBe('werdname');
  });

  it('tolerates undefined', () =>
  {
    expect(sanitize_name(undefined)).toBe('');
  });
});

describe('capitalize', () =>
{
  it('converts snake case to pascal case', () =>
  {
    expect(capitalize('my_cool_view')).toBe('MyCoolView');
  });
});

describe('Scaffolder create', () =>
{
  it('writes queued files and creates parent directories', () =>
  {
    const report = new Scaffolder({ root }).create('a/b/c.ts', 'hello').run();

    expect(report.applied).toBe(true);
    expect(read('a/b/c.ts')).toBe('hello');
  });

  it('refuses when a target already exists and writes nothing', () =>
  {
    write('existing.ts', 'original');

    const report = new Scaffolder({ root })
      .create('existing.ts', 'replacement')
      .create('fresh.ts', 'new')
      .run();

    expect(report.applied).toBe(false);
    expect(report.errors[0]).toContain('already exists');
    expect(read('existing.ts')).toBe('original');
    expect(fs.existsSync(path.join(root, 'fresh.ts'))).toBe(false);
  });
});

describe('Scaffolder patch', () =>
{
  it('replaces the first occurrence only', () =>
  {
    write('f.ts', 'anchor\nanchor\n');

    new Scaffolder({ root }).patch('f.ts', 'anchor', 'replaced').run();

    expect(read('f.ts')).toBe('replaced\nanchor\n');
  });

  it('refuses a second run rather than duplicating the insertion', () =>
  {
    write('f.ts', "import { HomeView } from './HomeView';\n");

    const plan = () => new Scaffolder({ root }).patch(
      'f.ts',
      "from './HomeView';",
      "from './HomeView';\nimport { GalleryView } from './GalleryView';",
      'register GalleryView'
    );

    expect(plan().run().applied).toBe(true);

    const second = plan().run();

    expect(second.applied).toBe(false);
    expect(second.errors[0]).toContain('already applied');
    // The import statement must appear exactly once. GalleryView itself occurs
    // twice per import, in the braces and in the path.
    expect(read('f.ts').match(/import \{ GalleryView \}/g)).toHaveLength(1);
  });

  it('refuses when the anchor is missing instead of silently doing nothing', () =>
  {
    write('f.ts', 'unrelated content');

    const report = new Scaffolder({ root }).patch('f.ts', '__SECTIONS__', 'x', 'add section').run();

    expect(report.applied).toBe(false);
    expect(report.errors[0]).toContain('anchor not found');
    expect(read('f.ts')).toBe('unrelated content');
  });

  it('refuses when the file to patch does not exist', () =>
  {
    const report = new Scaffolder({ root }).patch('missing.ts', 'a', 'b').run();

    expect(report.applied).toBe(false);
    expect(report.errors[0]).toContain('missing file');
  });
});

describe('Scaffolder atomicity and reporting', () =>
{
  it('writes nothing at all when any single step is invalid', () =>
  {
    write('ok.ts', 'anchor');

    const report = new Scaffolder({ root })
      .create('new.ts', 'x')
      .patch('ok.ts', 'anchor', 'patched')
      .patch('absent.ts', 'a', 'b')
      .run();

    expect(report.applied).toBe(false);
    expect(fs.existsSync(path.join(root, 'new.ts'))).toBe(false);
    expect(read('ok.ts')).toBe('anchor');
  });

  it('reports every problem at once rather than only the first', () =>
  {
    write('exists.ts', 'x');

    const report = new Scaffolder({ root })
      .create('exists.ts', 'y')
      .patch('absent.ts', 'a', 'b')
      .run();

    expect(report.errors).toHaveLength(2);
  });

  it('dry run reports the full plan and writes nothing', () =>
  {
    write('f.ts', 'anchor');

    const report = new Scaffolder({ root, dry_run: true })
      .create('new.ts', 'x')
      .patch('f.ts', 'anchor', 'patched', 'the patch')
      .run();

    expect(report.dry_run).toBe(true);
    expect(report.applied).toBe(false);
    expect(report.errors).toHaveLength(0);
    expect(report.created).toEqual(['new.ts']);
    expect(report.patched).toEqual([{ file: 'f.ts', label: 'the patch' }]);
    expect(fs.existsSync(path.join(root, 'new.ts'))).toBe(false);
    expect(read('f.ts')).toBe('anchor');
  });

  it('dry run still surfaces the errors a real run would hit', () =>
  {
    const report = new Scaffolder({ root, dry_run: true }).patch('absent.ts', 'a', 'b').run();

    expect(report.errors).toHaveLength(1);
  });
});
