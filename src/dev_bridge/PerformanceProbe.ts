export interface TimeLike
{
  delta_time: number;
  smooth_delta_time: number;
  elapsed_time: number;
}

export interface ScreenLike
{
  width: number;
  height: number;
  render_width: number;
  render_height: number;
  dpr: number;
}

export interface PerformanceReport
{
  fps: number;
  smooth_fps: number;
  frame_ms: number;
  elapsed_s: number;
  canvas: ScreenLike;
  draw_calls?: number;
  triangles?: number;
  geometries?: number;
  textures?: number;
}

// Reads frame timing and, when the renderer exposes them, its counters.
// Counters are omitted rather than zeroed when unavailable, because a reported
// zero draw calls is a claim, while an absent field is an admission.
class PerformanceProbe
{
  read(time: TimeLike, screen: ScreenLike, info: unknown): PerformanceReport
  {
    const report: PerformanceReport = {
      fps: this.rate(time.delta_time),
      smooth_fps: this.rate(time.smooth_delta_time),
      frame_ms: this.round(this.seconds(time.delta_time) * 1000, 100),
      elapsed_s: this.round(this.seconds(time.elapsed_time), 10),
      canvas: {
        width: screen.width,
        height: screen.height,
        render_width: screen.render_width,
        render_height: screen.render_height,
        dpr: screen.dpr
      }
    };

    const render = this.section(info, 'render');
    const memory = this.section(info, 'memory');

    this.assign(report, 'draw_calls', render, 'drawCalls');
    this.assign(report, 'triangles', render, 'triangles');
    this.assign(report, 'geometries', memory, 'geometries');
    this.assign(report, 'textures', memory, 'textures');

    return report;
  }

  private section(info: unknown, key: string): Record<string, unknown> | null
  {
    if (typeof info !== 'object' || info === null)
    {
      return null;
    }

    const section = (info as Record<string, unknown>)[key];

    if (typeof section !== 'object' || section === null)
    {
      return null;
    }

    return section as Record<string, unknown>;
  }

  private assign(report: PerformanceReport, field: keyof PerformanceReport, source: Record<string, unknown> | null, key: string): void
  {
    if (source === null)
    {
      return;
    }

    const value = source[key];

    if (typeof value === 'number' && Number.isFinite(value))
    {
      (report[field] as unknown) = value;
    }
  }

  // A zero delta on the first frame would otherwise report Infinity fps.
  private rate(delta: unknown): number
  {
    const seconds = this.seconds(delta);

    if (seconds <= 0)
    {
      return 0;
    }

    return this.round(1 / seconds, 10);
  }

  private seconds(value: unknown): number
  {
    return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0;
  }

  private round(value: number, factor: number): number
  {
    return Math.round(value * factor) / factor;
  }
}

export { PerformanceProbe };
