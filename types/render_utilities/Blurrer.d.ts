import { BoxBlurMaterial } from '../materials/BoxBlurMaterial';
import { RenderTarget } from 'three';
declare class Blurrer {
    RT1: RenderTarget;
    RT2: RenderTarget;
    box_blur_mat: BoxBlurMaterial;
    constructor();
    blur(RT: RenderTarget): void;
    dispose(): void;
}
export { Blurrer };
