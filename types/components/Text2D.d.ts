export class Text2D extends WorldImage {
    constructor(text: any, font: any, color: any, pivot: any, is_static: any);
    simple_text_drawer: SimpleTextDrawer;
    canvas_texture: any;
    draw_settings: {
        font: any;
        font_color: any;
    };
    set text(arg: string);
    get text(): string;
}
import { WorldImage } from "./WorldImage";
import { SimpleTextDrawer } from "../canvas_drawer/SimpleTextDrawer";
