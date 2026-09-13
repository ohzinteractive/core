import { describe, expect, it } from 'vitest';
import { RenderModeRegistry } from '../../src/dev_bridge/RenderModeRegistry';

function registry()
{
  return new RenderModeRegistry([
    { name: 'NormalRender', description: 'Standard forward rendering', factory: () => ({ kind: 'normal' }) },
    {
      name: 'NormalAORender',
      description: 'Forward rendering with SSAO',
      options: ['use_ssaa'],
      factory: (options) => ({ kind: 'ao', use_ssaa: options.use_ssaa === true })
    },
    {
      name: 'UnrealBloomRender',
      description: 'Bloom post-processing',
      options: ['use_antialiasing', 'use_half_float', 'use_high_luminosity_pass'],
      factory: (options) => ({ kind: 'bloom', args: options })
    }
  ]);
}

describe('RenderModeRegistry list', () =>
{
  it('lists every registered mode with its documented options', () =>
  {
    const listed = registry().list();

    expect(listed.map((m) => m.name)).toEqual(['NormalRender', 'NormalAORender', 'UnrealBloomRender']);
    expect(listed[1].options).toEqual(['use_ssaa']);
    expect(listed[0].options).toEqual([]);
    expect(listed[0].description).toBe('Standard forward rendering');
  });
});

describe('RenderModeRegistry create', () =>
{
  it('builds a mode by name', () =>
  {
    expect(registry().create('NormalRender', {})).toEqual({ kind: 'normal' });
  });

  it('passes options through to the factory', () =>
  {
    expect(registry().create('NormalAORender', { use_ssaa: true })).toEqual({ kind: 'ao', use_ssaa: true });
  });

  it('matches a name case insensitively', () =>
  {
    expect(registry().create('normalrender', {})).toEqual({ kind: 'normal' });
  });

  it('throws unknown_render_mode listing what is available', () =>
  {
    let caught: unknown;

    try
    {
      registry().create('Nope', {});
    }
    catch (error)
    {
      caught = error;
    }

    expect(caught).toMatchObject({ code: 'unknown_render_mode' });
    expect((caught as Error).message).toContain('NormalRender');
  });

  it('rejects a non-string name from the wire', () =>
  {
    expect(() => registry().create(42, {})).toThrowError(
      expect.objectContaining({ code: 'unknown_render_mode' })
    );
  });
});
