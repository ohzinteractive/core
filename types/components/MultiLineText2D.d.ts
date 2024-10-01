export class MultiLineText2D extends Object3D<import("three").Object3DEventMap> {
    /**
     * @param {string[]} text_array
     * @param {string} [font]
     * @param {string | number} [color]
     * @param {Vector2} [pivot]
     * @param {boolean} [is_static]
     */
    constructor(text_array: string[], font?: string, color?: string | number, pivot?: Vector2, is_static?: boolean);
    text_array: Text2D[];
    update_text_positions(): void;
    set texts(arg: string[]);
    /**
     * @returns {string[]}
     */
    get texts(): string[];
    set size(arg: number);
    get size(): number;
}
import { Object3D } from "three/src/core/Object3D";
import { Text2D } from "./Text2D";
import { Vector2 } from "three/src/math/Vector2";
