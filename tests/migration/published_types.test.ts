import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

// types/ is written by hand and npm publishes it as the package typings, so a
// class deleted from src must not leave an import behind in it.

const TYPES = fileURLToPath(new URL('../../types/', import.meta.url));

function is_file(path: string): boolean
{
  return existsSync(path) && statSync(path).isFile();
}

function unresolved_imports(): string[]
{
  const unresolved: string[] = [];
  const files = (readdirSync(TYPES, { recursive: true }) as string[]).filter(path => path.endsWith('.d.ts'));

  for (const file of files)
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

  it('exports BlitNodeMaterial in place of the GLSL base materials', () =>
  {
    const index = readFileSync(join(TYPES, 'index.d.ts'), 'utf8');

    expect(index).toMatch(/\bBlitNodeMaterial\b/);
    expect(index).not.toMatch(/\b(BlitMaterial|BaseShaderMaterial)\b/);
  });
});
