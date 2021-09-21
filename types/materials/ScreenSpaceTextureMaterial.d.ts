export default class ScreenSpaceTextureMaterial extends BaseShaderMaterial {
    constructor(x: any, y: any, w: any, h: any);
    set_position(x: any, y: any): void;
    set_texture(tex: any, w: any, h: any): void;
    set_screen_size(w: any, h: any): void;
}
import BaseShaderMaterial from "./BaseShaderMaterial";
