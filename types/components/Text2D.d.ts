import type { CanvasTexture, Vector2 } from "three";
import type { SimpleTextDrawer } from "../canvas_drawer/SimpleTextDrawer";
import { WorldImage } from "./WorldImage";

export class Text2D extends WorldImage {
    constructor(text: string, font: string, color: string | number, pivot: Vector2, is_static?: boolean);
    
    simple_text_drawer: SimpleTextDrawer;
    canvas_texture: CanvasTexture;
    draw_settings: {
        font: string;
        font_color: string | number;
    };
    set text(arg: string);
    get text(): string;
}
