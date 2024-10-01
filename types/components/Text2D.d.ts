export class Text2D extends WorldImage {
    /**
     * @param {string} text
     * @param {string} font
     * @param {string | Number} color
     * @param {Vector2} pivot
     * @param {boolean} [is_static]
     */
    constructor(text: string, font: string, color: string | number, pivot: Vector2, is_static?: boolean);
    simple_text_drawer: SimpleTextDrawer;
    canvas_texture: import("three").CanvasTexture;
    draw_settings: {
        font: string;
        font_color: string | number;
    };
    set text(arg: string);
    get text(): string;
}
import { WorldImage } from "./WorldImage";
import { SimpleTextDrawer } from "../canvas_drawer/SimpleTextDrawer";
import { Vector2 } from "three/src/math/Vector2";
