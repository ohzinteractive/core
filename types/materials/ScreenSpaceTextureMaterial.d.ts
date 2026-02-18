import type { Texture } from 'three';
import { BaseShaderMaterial } from './BaseShaderMaterial';
declare class ScreenSpaceTextureMaterial extends BaseShaderMaterial {
    constructor();
    set_position(x: number, y: number): void;
    set_texture(tex: Texture, w: number, h: number): void;
    set_screen_size(w: number, h: number): void;
}
export { ScreenSpaceTextureMaterial };
