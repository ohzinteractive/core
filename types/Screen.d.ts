import type { Vector2 } from 'three';
declare class Screen {
    init(): void;
    update_position(x: number, y: number): void;
    update(): void;
    update_size(width: number, height: number): void;
    apply_pixel_density_v2(vector2: Vector2): Vector2;
    apply_pixel_density(value: number): number;
    get_pixel_size(): Vector2;
    get aspect_ratio(): number;
}
declare const screen: Screen;
export { screen as Screen };
