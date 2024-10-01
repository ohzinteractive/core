export class Blurrer {
    constructor(renderer: any);
    RT1: WebGLRenderTarget<import("three").Texture>;
    RT2: WebGLRenderTarget<import("three").Texture>;
    box_blur_mat: BoxBlurMaterial;
    blur(RT: any): void;
}
import { WebGLRenderTarget } from "three/src/renderers/WebGLRenderTarget";
import { BoxBlurMaterial } from "../materials/BoxBlurMaterial";
