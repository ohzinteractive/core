import type { Vector2 } from "three";
import { CanvasDrawer } from "./CanvasDrawer";

export class SimpleTextDrawer extends CanvasDrawer {
    constructor();
    text_margin: Vector2;
    
    __draw(text: string, ctxOptions?: any, canvas?: HTMLCanvasElement, ctx?: CanvasRenderingContext2D): void;
}
