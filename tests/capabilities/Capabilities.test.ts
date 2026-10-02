import { describe, expect, it } from 'vitest';

import { Capabilities } from '../../src/Capabilities';

describe('Capabilities', () =>
{
  it('no longer carries the float texture flag nothing read', () =>
  {
    Capabilities.init();

    expect(Object.keys(Capabilities).sort()).toEqual(['max_anisotropy', 'vertex_texture_sampler_available']);
  });
});
