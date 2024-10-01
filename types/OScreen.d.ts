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
    /**
     * @param {number} x
     * @param {number} y
     */
    update_position(x: number, y: number): void;
    update(): void;
    size_changed: boolean;
    /**
     * @param {number} width
     * @param {number} height
     */
    update_size(width: number, height: number): void;
    /**
     * @param {Vector2} vector2
     */
    apply_pixel_density_v2(vector2: Vector2): Vector2;
    /**
     * @param {number} value
     */
    apply_pixel_density(value: number): number;
    get_pixel_size(): Vector2;
    get aspect_ratio(): number;
    get portrait(): boolean;
}
import { Vector2 } from "three/src/math/Vector2";
