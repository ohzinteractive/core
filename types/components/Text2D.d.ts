import { SimpleTextDrawer } from '../canvas_drawer/SimpleTextDrawer';
import { WorldImage } from './WorldImage';
import type { CanvasTexture, Vector2 } from 'three';
declare class Text2D extends WorldImage {
    canvas_texture: CanvasTexture;
    draw_settings: {
        font: string;
        font_color: string | number;
    };
    simple_text_drawer: SimpleTextDrawer;
    constructor(text: string, font: string, color: string | number, pivot: Vector2);
    set text(value: string);
    get text(): string;
}
export { Text2D };
