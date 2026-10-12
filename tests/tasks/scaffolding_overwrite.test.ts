import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
// @ts-expect-error plain .mjs scaffolder script
import { Scaffolder } from '../../tasks/_shared/scaffolding.mjs';

let root: string;

beforeEach(() => { root = fs.mkdtempSync(path.join(os.tmpdir(), 'ohzi-overwrite-')); });
afterEach(() => { fs.rmSync(root, { recursive: true, force: true }); });

const file = (r: string) => path.join(root, r);

describe('Scaffolder overwrite', () =>
{
  it('still refuses an existing file by default', () =>
  {
    fs.writeFileSync(file('a.txt'), 'old');

    const report = new Scaffolder({ root }).create('a.txt', 'new').run();

    expect(report.applied).toBe(false);
    expect(report.errors.join(' ')).toContain('already exists: a.txt');
    expect(fs.readFileSync(file('a.txt'), 'utf8')).toBe('old');
  });

  it('replaces an existing file when asked and reports it as overwritten', () =>
  {
    fs.writeFileSync(file('a.txt'), 'old');

    const report = new Scaffolder({ root }).create('a.txt', 'new', { overwrite: true }).run();

    expect(report.applied).toBe(true);
    expect(report.overwritten).toEqual(['a.txt']);
    expect(report.created).toEqual([]);
    expect(fs.readFileSync(file('a.txt'), 'utf8')).toBe('new');
  });

  it('reports an overwrite of a missing file as a create', () =>
  {
    const report = new Scaffolder({ root }).create('a.txt', 'new', { overwrite: true }).run();

    expect(report.created).toEqual(['a.txt']);
    expect(report.overwritten).toEqual([]);
  });

  it('writes binary contents byte for byte', () =>
  {
    const bytes = Buffer.from([0x67, 0x6c, 0x54, 0x46, 0x00, 0xff, 0x80]);

    new Scaffolder({ root }).create('public/models/a.glb', bytes).run();

    expect(fs.readFileSync(file('public/models/a.glb')).equals(bytes)).toBe(true);
  });

  it('dry run overwrites nothing', () =>
  {
    fs.writeFileSync(file('a.txt'), 'old');

    const report = new Scaffolder({ root, dry_run: true }).create('a.txt', 'new', { overwrite: true }).run();

    expect(report.overwritten).toEqual(['a.txt']);
    expect(report.applied).toBe(false);
    expect(fs.readFileSync(file('a.txt'), 'utf8')).toBe('old');
  });
});
