import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

// GLSL still waiting for its TSL port, as paths relative to src/, grouped by the
// migration session that removes it.
// A session deletes its block first, so this test fails until its GLSL is gone.
// New GLSL fails it too. In TSL modules, say "GLSL material" in comments, not the
// three class name, or the module gets flagged.

const SRC = fileURLToPath(new URL('../../src/', import.meta.url));

const GLSL_FILES = [
  // Session 6: MedianFilter
  'shaders/median_filter/median_filter.frag',
  // Session 7: GPU particles
  'shaders/gpu_particles/common_utils.glsl',
  'shaders/gpu_particles/generic_storage.frag',
  'shaders/gpu_particles/update/basic_update.frag',
  'shaders/gpu_particles/visualize/visualize.frag',
  'shaders/gpu_particles/visualize/visualize.vert',
  // Session 8: GLSL base classes
  'shaders/basic_color/basic_color.frag',
  'shaders/basic_color/basic_color.vert',
  'shaders/copy/copy.frag',
  'shaders/copy/copy.vert'
];

const GLSL_BACKED_MODULES = [
  // Session 6: MedianFilter
  'materials/MedianFilterMaterial.ts',
  // Session 7: GPU particles
  'materials/gpu_particles/AttributeUpdateMaterial.ts',
  'materials/gpu_particles/BasicParticleMaterial.ts',
  'materials/gpu_particles/ParticleStorageMaterial.ts',
  'materials/gpu_particles/PositionStorageMaterial.ts',
  // Session 8: GLSL base classes
  'materials/BaseShaderMaterial.ts',
  'materials/BlitMaterial.ts'
];

// A module is GLSL backed when it imports a shader file, builds or patches a
// GLSL material, inlines GLSL, or extends one of the GLSL base materials.
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

function is_glsl_backed(path: string): boolean
{
  const source = readFileSync(join(SRC, path), 'utf8');

  return GLSL_MARKERS.some(marker => marker.test(source));
}

describe('GLSL inventory', () =>
{
  it('lists every GLSL file left in src', () =>
  {
    const found = source_paths().filter(path => /\.(frag|vert|glsl)$/.test(path));

    expect(found).toEqual([...GLSL_FILES].sort());
  });

  it('lists every module still backed by GLSL', () =>
  {
    const found = source_paths()
      .filter(path => path.endsWith('.ts') && !path.endsWith('.d.ts'))
      .filter(is_glsl_backed);

    expect(found).toEqual([...GLSL_BACKED_MODULES].sort());
  });
});
