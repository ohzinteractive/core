import type { Vector2 } from "three";

export { oscreen as OScreen };
declare const oscreen: OScreen;
declare class OScreen {
    init(): void;
    width: number;
    height: number;
    position: Vector2;
    render_width: number;
    render_height: number;
    width_height: Vector2;
    dpr: number;
    pixel_size: Vector2;
    size_changed: boolean;

    get aspect_ratio(): number;
    get portrait(): boolean;

    update_position(x: number, y: number): void;
    update(): void;
    update_size(width: number, height: number): void;
    apply_pixel_density_v2(vector2: Vector2): Vector2;
    apply_pixel_density(value: number): number;
    get_pixel_size(): Vector2;
}
