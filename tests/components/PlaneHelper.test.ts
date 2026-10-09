import { describe, expect, it } from 'vitest';

import { PlaneHelper } from '../../src/components/PlaneHelper';

describe('PlaneHelper', () =>
{
  it('dispose fires its own dispose event, which WebGPURenderer listens to', () =>
  {
    const helper = new PlaneHelper();
    let disposals = 0;
    helper.addEventListener('dispose', () => disposals++);

    helper.dispose();

    expect(disposals).toBe(1);
  });
});
