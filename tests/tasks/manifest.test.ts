import { describe, expect, it } from 'vitest';
// @ts-expect-error plain .mjs scaffolder script
import { append_entry, manifest_path, model_url, parse_entries, with_draco, with_size } from '../../tasks/import_model/manifest.mjs';

const COMMENTED = `export const home_objects = [
  // {
  //   name: 'cube',
  //   url: '/models/cube.glb',
  //   size: 12192,
  //   draco: false
  // }
];
`;

const ONE_ENTRY_NO_COMMA = `export const home_objects = [
  {
    name: 'table',
    url: '/models/table.glb',
    size: 10,
    draco: false
  }
];
`;

const CHAIR = { name: 'chair', url: '/models/chair.glb', size: 42, draco: true };

const CHAIR_TEXT = `  {
    name: 'chair',
    url: '/models/chair.glb',
    size: 42,
    draco: true
  }`;

// The appended manifest must still be a valid array literal.
function evaluate(text: string): unknown[]
{
  const body = text.replace(/^export const \w+ = /, 'return ');

  return new Function(body)() as unknown[];
}

describe('paths', () =>
{
  it('builds manifest paths and URLs per tier', () =>
  {
    expect(manifest_path('home', 'regular')).toBe('app/data/assets/home/home_objects.js');
    expect(manifest_path('home', 'high')).toBe('app/data/assets/home/high/home_high_objects.js');
    expect(model_url('chair', 'regular')).toBe('/models/chair.glb');
    expect(model_url('chair', 'high')).toBe('/models/high/chair.glb');
  });
});

describe('parse_entries', () =>
{
  it('ignores commented entries', () =>
  {
    expect(parse_entries(COMMENTED)).toEqual([]);
  });

  it('reads name, url, size and the exact entry text', () =>
  {
    const [entry] = parse_entries(ONE_ENTRY_NO_COMMA);

    expect(entry.name).toBe('table');
    expect(entry.url).toBe('/models/table.glb');
    expect(entry.size).toBe(10);
    expect(ONE_ENTRY_NO_COMMA).toContain(entry.text);
    expect(entry.text.startsWith('{')).toBe(true);
  });

  it('reports a missing size as null', () =>
  {
    const [entry] = parse_entries(`export const a = [\n  { name: 'x', url: '/models/x.glb' }\n];\n`);

    expect(entry.size).toBeNull();
  });
});

describe('append_entry', () =>
{
  it('appends after only commented entries', () =>
  {
    const text = append_entry(COMMENTED, CHAIR);

    expect(text).toContain(`  // }\n${CHAIR_TEXT}\n];`);
    expect(evaluate(text)).toEqual([CHAIR]);
  });

  it('adds the missing comma after the last real entry', () =>
  {
    const text = append_entry(ONE_ENTRY_NO_COMMA, CHAIR);

    expect(text).toContain(`    draco: false\n  },\n${CHAIR_TEXT}\n];`);
    expect(evaluate(text)).toHaveLength(2);
  });

  it('keeps an existing trailing comma', () =>
  {
    const text = append_entry(ONE_ENTRY_NO_COMMA.replace('  }\n];', '  },\n];'), CHAIR);

    expect(text).not.toContain('},,');
    expect(evaluate(text)).toHaveLength(2);
  });

  it('expands an empty one-line array', () =>
  {
    const text = append_entry('export const home_objects = [];\n', CHAIR);

    expect(evaluate(text)).toEqual([CHAIR]);
  });

  it('puts the comma before a trailing comment on the last entry', () =>
  {
    const text = append_entry(ONE_ENTRY_NO_COMMA.replace('  }\n];', '  } // the table\n];'), CHAIR);

    expect(text).toContain('  }, // the table\n');
    expect(evaluate(text)).toHaveLength(2);
  });

  it('leaves a last entry that already has its comma and a comment alone', () =>
  {
    const text = append_entry(ONE_ENTRY_NO_COMMA.replace('  }\n];', '  }, // the table\n];'), CHAIR);

    expect(text).toContain('  }, // the table\n');
    expect(text).not.toContain('},,');
    expect(evaluate(text)).toHaveLength(2);
  });

  it('refuses a file with no array to append to', () =>
  {
    expect(() => append_entry('export const home_objects = {};\n', CHAIR)).toThrowError(/no closing/);
  });
});

describe('property names', () =>
{
  it('does not read file_name, texture_url, max_size or old_draco as the real keys', () =>
  {
    const text = `export const a = [\n  {\n    file_name: 'x',\n    texture_url: '/textures/x.png',\n    max_size: 1,\n    old_draco: true,\n    name: 'chair',\n    url: '/models/chair.glb',\n    size: 42,\n    draco: false\n  }\n];\n`;
    const [entry] = parse_entries(text);

    expect(entry.name).toBe('chair');
    expect(entry.url).toBe('/models/chair.glb');
    expect(entry.size).toBe(42);
    expect(with_size(entry.text, 7)).toContain('max_size: 1');
    expect(with_size(entry.text, 7)).toContain('    size: 7,');
    expect(with_draco(entry.text, true)).toContain('old_draco: true');
    expect(with_draco(entry.text, true)).toContain('    draco: true\n');
    expect(with_draco(entry.text, true)).not.toContain('draco: false');
  });

  it('does not take a name that only ends in name: for the entry name', () =>
  {
    const [entry] = parse_entries(`export const a = [\n  { file_name: 'x', name: 'chair', url: '/models/chair.glb' }\n];\n`);

    expect(entry.name).toBe('chair');
  });
});

describe('with_size', () =>
{
  it('rewrites only the size', () =>
  {
    const [entry] = parse_entries(ONE_ENTRY_NO_COMMA);

    expect(with_size(entry.text, 99)).toBe(entry.text.replace('size: 10', 'size: 99'));
  });
});

describe('with_draco', () =>
{
  it('rewrites an existing draco flag', () =>
  {
    const [entry] = parse_entries(ONE_ENTRY_NO_COMMA);

    expect(with_draco(entry.text, true)).toBe(entry.text.replace('draco: false', 'draco: true'));
  });

  it('inserts draco: true as the last property when the key is absent', () =>
  {
    const text = `export const home_objects = [\n  {\n    name: 'table',\n    url: '/models/table.glb',\n    size: 10\n  }\n];\n`;
    const [entry] = parse_entries(text);
    const updated = with_draco(entry.text, true);

    expect(updated).toBe(`{\n    name: 'table',\n    url: '/models/table.glb',\n    size: 10,\n    draco: true\n  }`);
    expect(evaluate(text.replace(entry.text, updated))).toEqual([
      { name: 'table', url: '/models/table.glb', size: 10, draco: true }
    ]);
  });

  it('puts the comma before a trailing comment on the last property', () =>
  {
    const text = `export const home_objects = [\n  {\n    name: 'table',\n    url: '/models/table.glb',\n    size: 10 // bytes\n  }\n];\n`;
    const [entry] = parse_entries(text);
    const updated = with_draco(entry.text, true);

    expect(updated).toContain('size: 10, // bytes\n    draco: true');
    expect(evaluate(text.replace(entry.text, updated))).toEqual([
      { name: 'table', url: '/models/table.glb', size: 10, draco: true }
    ]);
  });

  it('keeps a // inside a string value when it looks for the comment', () =>
  {
    const text = `export const home_objects = [\n  {\n    name: 'table',\n    url: 'http://cdn/table.glb' // remote\n  }\n];\n`;
    const [entry] = parse_entries(text);

    expect(evaluate(text.replace(entry.text, with_draco(entry.text, true)))).toEqual([
      { name: 'table', url: 'http://cdn/table.glb', draco: true }
    ]);
  });

  it('leaves the entry alone when the key is absent and draco is false', () =>
  {
    const [entry] = parse_entries(`export const a = [\n  { name: 'x', url: '/models/x.glb' }\n];\n`);

    expect(with_draco(entry.text, false)).toBe(entry.text);
  });
});
