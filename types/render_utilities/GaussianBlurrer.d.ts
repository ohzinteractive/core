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
        minFilter: any;
        magFilter: any;
        format: any;
    };
    renderTargetBright: any;
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
import { LuminosityHighPassMaterial } from "../materials/LuminosityHighPassMaterial";
