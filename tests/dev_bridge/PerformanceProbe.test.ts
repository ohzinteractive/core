import { describe, expect, it } from 'vitest';
import { PerformanceProbe } from '../../src/dev_bridge/PerformanceProbe';

const time = { delta_time: 1 / 60, smooth_delta_time: 1 / 30, elapsed_time: 12.5 };
const screen = { width: 834, height: 770, render_width: 1668, render_height: 1540, dpr: 2 };

const probe = new PerformanceProbe();

describe('PerformanceProbe', () =>
{
  it('derives fps from delta time and smooth fps from smooth delta time', () =>
  {
    const report = probe.read(time, screen, undefined);

    expect(report.fps).toBe(60);
    expect(report.smooth_fps).toBe(30);
    expect(report.frame_ms).toBeCloseTo(16.67, 1);
  });

  it('reports the canvas in both logical and physical pixels', () =>
  {
    const report = probe.read(time, screen, undefined);

    expect(report.canvas).toEqual({ width: 834, height: 770, render_width: 1668, render_height: 1540, dpr: 2 });
  });

  it('survives a zero delta on the first frame instead of returning Infinity', () =>
  {
    const report = probe.read({ delta_time: 0, smooth_delta_time: 0, elapsed_time: 0 }, screen, undefined);

    expect(report.fps).toBe(0);
    expect(report.smooth_fps).toBe(0);
  });

  it('includes renderer counters when the renderer exposes them', () =>
  {
    const report = probe.read(time, screen, {
      render: { drawCalls: 12, triangles: 3456 },
      memory: { geometries: 4, textures: 7 }
    });

    expect(report.draw_calls).toBe(12);
    expect(report.triangles).toBe(3456);
    expect(report.geometries).toBe(4);
    expect(report.textures).toBe(7);
  });

  it('omits renderer counters rather than reporting zeros when unavailable', () =>
  {
    const report = probe.read(time, screen, undefined);

    expect(report.draw_calls).toBeUndefined();
    expect(report.triangles).toBeUndefined();
  });

  it('ignores a malformed info object', () =>
  {
    const report = probe.read(time, screen, { render: 'nope' });

    expect(report.draw_calls).toBeUndefined();
  });
});
