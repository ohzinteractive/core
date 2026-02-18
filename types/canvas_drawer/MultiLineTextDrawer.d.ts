import { Vector2 } from "three";
import { CanvasDrawer } from "./CanvasDrawer";

export class MultiLineTextDrawer extends CanvasDrawer {
    constructor();
    text_margin: Vector2;
    __draw(text_array: string[], ctxOptions?: any, canvas?: HTMLCanvasElement, ctx?: CanvasRenderingContext2D): void;
}
