import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

// types/ is generated from src by `yarn generate-types` and npm publishes it as
// the package typings, so these tests catch a types/ that was not regenerated
// after src changed.

const TYPES = fileURLToPath(new URL('../../types/', import.meta.url));
const SRC_INDEX = fileURLToPath(new URL('../../src/index.ts', import.meta.url));

function is_file(path: string): boolean
{
  return existsSync(path) && statSync(path).isFile();
}

function exported_names(path: string): string[]
{
  const source = readFileSync(path, 'utf8');
  const names: string[] = [];

  for (const match of source.matchAll(/export\s*\{([^}]*)\}/g))
  {
    for (const entry of match[1].split(','))
    {
      const name = entry.trim().split(/\s+as\s+/).pop();

      if (name)
      {
        names.push(name);
      }
    }
  }

  return names.sort();
}

function declaration_paths(): string[]
{
  return (readdirSync(TYPES, { recursive: true }) as string[]).filter(path => path.endsWith('.d.ts')).sort();
}

function unresolved_imports(): string[]
{
  const unresolved: string[] = [];

  for (const file of declaration_paths())
  {
    const source = readFileSync(join(TYPES, file), 'utf8');

    for (const match of source.matchAll(/(?:from\s+|import\()["'](\.{1,2}\/[^"']+)["']/g))
    {
      const base = join(TYPES, dirname(file), match[1]);
      const candidates = [`${base}.d.ts`, `${base}.ts`, base, join(base, 'index.d.ts')];

      if (!candidates.some(is_file))
      {
        unresolved.push(`${file} -> ${match[1]}`);
      }
    }
  }

  return unresolved.sort();
}

describe('published types', () =>
{
  it('resolves every relative import', () =>
  {
    expect(unresolved_imports()).toEqual([]);
  });

  it('exports every name src/index.ts exports', () =>
  {
    expect(exported_names(join(TYPES, 'index.d.ts'))).toEqual(exported_names(SRC_INDEX));
  });

  it('exports BlitNodeMaterial in place of the GLSL base materials', () =>
  {
    const index = readFileSync(join(TYPES, 'index.d.ts'), 'utf8');

    expect(index).toMatch(/\bBlitNodeMaterial\b/);
    expect(index).not.toMatch(/\b(BlitMaterial|BaseShaderMaterial)\b/);
  });

  it('declares no GLSL material', () =>
  {
    const found = declaration_paths()
      .filter(path => /\b(Raw)?ShaderMaterial\b/.test(readFileSync(join(TYPES, path), 'utf8')));

    expect(found).toEqual([]);
  });
});
