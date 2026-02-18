import { CanvasDrawer } from './CanvasDrawer';
import { Vector2 } from 'three';
declare class MultiLineTextDrawer extends CanvasDrawer {
    text_margin: Vector2;
    constructor();
    __draw(text_array: string[], ctxOptions: any, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void;
}
export { MultiLineTextDrawer };
