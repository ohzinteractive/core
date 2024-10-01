export class MultiLineTextDrawer extends CanvasDrawer {
    constructor();
    text_margin: Vector2;
    /**
     * @param {string[]} text_array
     * @param {any} [ctxOptions]
     * @param {HTMLCanvasElement} [canvas]
     * @param {CanvasRenderingContext2D} [ctx]
     */
    __draw(text_array: string[], ctxOptions?: any, canvas?: HTMLCanvasElement, ctx?: CanvasRenderingContext2D): void;
}
import { CanvasDrawer } from "./CanvasDrawer";
import { Vector2 } from "three/src/math/Vector2";
