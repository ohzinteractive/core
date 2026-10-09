import { describe, expect, it } from 'vitest';

import { AxisHelper } from '../../src/components/AxisHelper';

describe('AxisHelper', () =>
{
  it('dispose fires its own dispose event, which WebGPURenderer listens to', () =>
  {
    const helper = new AxisHelper();
    let disposals = 0;
    helper.addEventListener('dispose', () => disposals++);

    helper.dispose();

    expect(disposals).toBe(1);
  });
});
