import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

// Core is TSL only. This guard fails on any GLSL file or any module backed by GLSL.
// In TSL modules, say "GLSL material" in comments, not the three class name, or the
// module gets flagged.

const SRC = fileURLToPath(new URL('../../src/', import.meta.url));

// A module is GLSL backed when it imports a shader file, builds or patches a
// GLSL material, inlines GLSL, or extends one of the removed GLSL base materials.
const GLSL_MARKERS = [
  /from '[^']+\.(frag|vert|glsl)'/,
  /\b(Raw)?ShaderMaterial\b/,
  /\bonBeforeCompile\b/,
  /\bgl_(Position|FragColor|PointSize)\b/,
  /extends (BlitMaterial|BaseShaderMaterial)\b/
];

function source_paths(): string[]
{
  return (readdirSync(SRC, { recursive: true }) as string[]).sort();
}

function read(path: string): string
{
  return readFileSync(join(SRC, path), 'utf8');
}

describe('no GLSL', () =>
{
  it('has no GLSL file in src', () =>
  {
    const found = source_paths().filter(path => /\.(frag|vert|glsl)$/.test(path));

    expect(found).toEqual([]);
  });

  it('has no module backed by GLSL', () =>
  {
    const found = source_paths()
      .filter(path => path.endsWith('.ts') && !path.endsWith('.d.ts'))
      .filter(path => GLSL_MARKERS.some(marker => marker.test(read(path))));

    expect(found).toEqual([]);
  });
});
