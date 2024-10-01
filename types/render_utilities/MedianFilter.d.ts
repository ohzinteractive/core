export class MedianFilter {
    constructor(renderer: any);
    RT: WebGLRenderTarget<import("three").Texture>;
    RT1: WebGLRenderTarget<import("three").Texture>;
    median_filter_mat: MedianFilterMaterial;
    filter(texture: any): WebGLRenderTarget<import("three").Texture>;
    get_size(tex: any): Vector2;
}
import { WebGLRenderTarget } from "three/src/renderers/WebGLRenderTarget";
import { MedianFilterMaterial } from "../materials/MedianFilterMaterial";
import { Vector2 } from "three/src/math/Vector2";
