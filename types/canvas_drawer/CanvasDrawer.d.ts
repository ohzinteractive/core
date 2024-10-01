export class CanvasDrawer {
    /**
     * @param {boolean} [uses_dynamic_font]
     */
    constructor(uses_dynamic_font?: boolean);
    uses_dynamic_font: boolean;
    __textHeight: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    getFontHeight(fontStyle?: string): number;
    /**
     * @param {string} text
     * @param {string} font
     */
    get_text_size(text: string, font?: string): Vector2;
    /**
     * @param {string} text
     * @param {any} [ctxOptions]
     */
    draw_canvas(text: string, ctxOptions?: any): HTMLCanvasElement;
    /**
     * @param {string} text
     * @param {any} [ctxOptions]
     */
    draw_on_texture(text: string, ctxOptions?: any): CanvasTexture;
    /**
     * @param {string[] | string} text
     * @param {any} [ctxOptions]
     * @param {HTMLCanvasElement} [canvas]
     * @param {CanvasRenderingContext2D} [ctx]
     */
    __draw(text: string[] | string, ctxOptions?: any, canvas?: HTMLCanvasElement, ctx?: CanvasRenderingContext2D): void;
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {number | {tl:number, tr:number, br:number, bl:number}} radius
     * @param {boolean} fill
     * @param {boolean} stroke
     */
    roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number | {
        tl: number;
        tr: number;
        br: number;
        bl: number;
    }, fill: boolean, stroke: boolean): void;
}
import { Vector2 } from "three/src/math/Vector2";
import { CanvasTexture } from "three/src/textures/CanvasTexture";
