export class CanvasDrawer {
    constructor(uses_dynamic_font: any);
    uses_dynamic_font: any;
    __textHeight: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    getFontHeight(fontStyle?: string): number;
    get_text_size(text: any, font?: string): any;
    draw_canvas(text: any, ctxOptions?: {}): HTMLCanvasElement;
    draw_on_texture(text: any, ctxOptions: any): any;
    __draw(text: any, ctxOptions: any): void;
    roundRect(ctx: any, x: any, y: any, width: any, height: any, radius: any, fill: any, stroke: any): void;
}
