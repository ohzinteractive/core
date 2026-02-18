import type { RenderTarget, Texture } from "three";
import type { BoxBlurMaterial } from "../materials/BoxBlurMaterial";

export class Blurrer {
    constructor(renderer: any);
    RT1: RenderTarget<Texture>;
    RT2: RenderTarget<Texture>;
    box_blur_mat: BoxBlurMaterial;
    blur(RT: any): void;
}
