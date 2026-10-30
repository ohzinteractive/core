import { CanvasTexture, Vector2 } from 'three';
declare class CanvasDrawer {
    __textHeight: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    uses_dynamic_font: boolean;
    constructor(uses_dynamic_font?: boolean);
    getFontHeight(fontStyle?: string): number;
    get_text_size(text: string, font?: string): Vector2;
    draw_canvas(text: string, ctxOptions?: {}): HTMLCanvasElement;
    draw_on_texture(text: string, ctxOptions: any): CanvasTexture<HTMLCanvasElement>;
    __draw(text: string[] | string, ctxOptions: any, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void;
    roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number | {
        tl: number;
        tr: number;
        br: number;
        bl: number;
    }, fill: boolean, stroke: boolean): void;
}
export { CanvasDrawer };
