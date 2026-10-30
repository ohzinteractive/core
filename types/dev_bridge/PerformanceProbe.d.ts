export interface TimeLike {
    delta_time: number;
    smooth_delta_time: number;
    elapsed_time: number;
}
export interface ScreenLike {
    width: number;
    height: number;
    render_width: number;
    render_height: number;
    dpr: number;
}
export interface PerformanceReport {
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
declare class PerformanceProbe {
    read(time: TimeLike, screen: ScreenLike, info: unknown): PerformanceReport;
    private section;
    private assign;
    private rate;
    private seconds;
    private round;
}
export { PerformanceProbe };
