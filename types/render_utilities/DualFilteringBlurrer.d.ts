export class DualFilteringBlurrer {
    constructor(use_alpha_mask: any);
    current_width: number;
    current_height: number;
    RT0: any;
    RT1: any;
    RT2: any;
    RT3: any;
    RT4: any;
    upscale_blur_mat: DualFilteringBlurMaterial;
    downscale_blur_mat: DualFilteringBlurMaterial;
    alpha_filter_mat: AlphaFilterMaterial;
    blur(RT: any): void;
    check_RT_resize(width: any, height: any): void;
}
import { DualFilteringBlurMaterial } from "../materials/DualFilteringBlurMaterial";
import { AlphaFilterMaterial } from "../materials/AlphaFilterMaterial";
