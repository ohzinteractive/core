import { RenderTarget } from 'three';
import { DualFilteringBlurMaterial } from '../materials/DualFilteringBlurMaterial';
declare class DualFilteringBlurrer {
    RT0: RenderTarget;
    RT1: RenderTarget;
    RT2: RenderTarget;
    RT3: RenderTarget;
    RT4: RenderTarget;
    current_height: number;
    current_width: number;
    downscale_blur_mat: DualFilteringBlurMaterial;
    upscale_blur_mat: DualFilteringBlurMaterial;
    constructor();
    blur(RT: RenderTarget): void;
    check_RT_resize(width: number, height: number): void;
    dispose(): void;
    resize(target: RenderTarget, divisor: number): void;
}
export { DualFilteringBlurrer };
