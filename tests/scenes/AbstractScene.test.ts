import { describe, expect, it } from 'vitest';

import { AbstractScene } from '../../src/scenes/AbstractScene';

describe('AbstractScene', () =>
{
  it('dispose fires its own dispose event, which WebGPURenderer listens to', () =>
  {
    const scene = new AbstractScene({ name: 'test', compilators: [] });
    let disposals = 0;
    scene.addEventListener('dispose', () => disposals++);

    scene.dispose();

    expect(disposals).toBe(1);
  });
});
