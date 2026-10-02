import type { Texture } from 'three';
import { BlitNodeMaterial } from './BlitNodeMaterial';
declare class ScreenSpaceTextureMaterial extends BlitNodeMaterial {
    constructor();
    set_position(x: number, y: number): void;
    set_texture(tex: Texture, w: number, h: number): void;
    set_screen_size(w: number, h: number): void;
}
export { ScreenSpaceTextureMaterial };
