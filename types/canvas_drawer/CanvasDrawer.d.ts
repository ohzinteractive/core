import type { CanvasTexture, Vector2 } from "three";

export class CanvasDrawer {
    constructor(uses_dynamic_font?: boolean);
    uses_dynamic_font: boolean;
    __textHeight: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    
    getFontHeight(fontStyle?: string): number;
    get_text_size(text: string, font?: string): Vector2;
    draw_canvas(text: string, ctxOptions?: any): HTMLCanvasElement;
    draw_on_texture(text: string, ctxOptions?: any): CanvasTexture;
    __draw(text: string[] | string, ctxOptions?: any, canvas?: HTMLCanvasElement, ctx?: CanvasRenderingContext2D): void;
    roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number | {
        tl: number;
        tr: number;
        br: number;
        bl: number;
    }, fill: boolean, stroke: boolean): void;
}
