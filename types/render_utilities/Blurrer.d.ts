export class Blurrer {
    constructor(renderer: any);
    RT1: any;
    RT2: any;
    box_blur_mat: BoxBlurMaterial;
    blur(RT: any): void;
}
import { BoxBlurMaterial } from "../materials/BoxBlurMaterial";
