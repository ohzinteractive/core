export { screen as Screen };
declare const screen: Screen;
declare class Screen {
    init(): void;
    /**
     * @param {number} x
     * @param {number} y
     */
    update_position(x: number, y: number): void;
    update(): void;
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
}
import { Vector2 } from "three/src/math/Vector2";
