import type { RenderTarget, Texture } from "three";
import type { LuminosityHighPassMaterial } from "../materials/LuminosityHighPassMaterial";

export class GaussianBlurrer {
    constructor(nMips?: number);
    current_width: number;
    current_height: number;
    separableBlurMaterials: any[];
    renderTargetsHorizontal: any[];
    renderTargetsVertical: any[];
    nMips: number;
    kernelSizeArray: number[];
    rt_pars: {
        minFilter: 1006;
        magFilter: 1006;
        format: 1023;
    };
    renderTargetBright: RenderTarget<Texture>;
    luminosity_high_pass_mat: LuminosityHighPassMaterial;
    
    blur(RT: any, use_luminosity_high_pass: any): void;
    get_blurred_texture(): any;
    get_blurred_RT(): any;
    init_RT(): void;
    resize_RT(texture_width: any, texture_height: any): void;
    init_materials(texture_width: any, texture_height: any): void;
    dispose_materials(): void;
    dispose_RT(): void;
}
