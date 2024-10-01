export class DualFilteringBlurrer {
    constructor(use_alpha_mask: any);
    current_width: number;
    current_height: number;
    RT0: WebGLRenderTarget<import("three").Texture>;
    RT1: WebGLRenderTarget<import("three").Texture>;
    RT2: WebGLRenderTarget<import("three").Texture>;
    RT3: WebGLRenderTarget<import("three").Texture>;
    RT4: WebGLRenderTarget<import("three").Texture>;
    upscale_blur_mat: DualFilteringBlurMaterial;
    downscale_blur_mat: DualFilteringBlurMaterial;
    alpha_filter_mat: AlphaFilterMaterial;
    blur(RT: any): void;
    check_RT_resize(width: any, height: any): void;
}
import { WebGLRenderTarget } from "three/src/renderers/WebGLRenderTarget";
import { DualFilteringBlurMaterial } from "../materials/DualFilteringBlurMaterial";
import { AlphaFilterMaterial } from "../materials/AlphaFilterMaterial";
