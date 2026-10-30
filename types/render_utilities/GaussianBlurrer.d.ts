import { GaussianBlurMaterial } from '../materials/GaussianBlurMaterial';
import { LuminosityHighPassMaterial } from '../materials/LuminosityHighPassMaterial';
import type { RenderTargetOptions } from 'three';
import { RenderTarget } from 'three';
declare class GaussianBlurrer {
    current_height: number;
    current_width: number;
    kernelSizeArray: number[];
    luminosity_high_pass_mat: LuminosityHighPassMaterial;
    nMips: number;
    renderTargetBright: RenderTarget;
    renderTargetsHorizontal: Array<RenderTarget>;
    renderTargetsVertical: Array<RenderTarget>;
    rt_pars: RenderTargetOptions;
    separableBlurMaterials: Array<GaussianBlurMaterial>;
    use_half_float: boolean;
    constructor(use_half_float?: boolean);
    blur(RT: RenderTarget, use_luminosity_high_pass: boolean): void;
    get_blurred_texture(): import("three").Texture<unknown, import("three").TextureEventMap>;
    get_blurred_RT(): RenderTarget<import("three").Texture<unknown, import("three").TextureEventMap>, import("three").RenderTargetEventMap>;
    init_RT(): void;
    resize_RT(texture_width: number, texture_height: number): void;
    init_materials(): void;
    set_radius(value: number): void;
    set_luminosity_threshold(value: number): void;
    dispose_materials(): void;
    dispose_RT(): void;
}
export { GaussianBlurrer };
