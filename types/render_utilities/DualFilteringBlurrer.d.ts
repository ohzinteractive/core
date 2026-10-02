import type { RenderTarget, Texture } from "three";
import type { DualFilteringBlurMaterial } from "../materials/DualFilteringBlurMaterial";
export class DualFilteringBlurrer {
    constructor();
    current_width: number;
    current_height: number;
    RT0: RenderTarget<Texture>;
    RT1: RenderTarget<Texture>;
    RT2: RenderTarget<Texture>;
    RT3: RenderTarget<Texture>;
    RT4: RenderTarget<Texture>;
    upscale_blur_mat: DualFilteringBlurMaterial;
    downscale_blur_mat: DualFilteringBlurMaterial;
    blur(RT: any): void;
    check_RT_resize(width: any, height: any): void;
}
