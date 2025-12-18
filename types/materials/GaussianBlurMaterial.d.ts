export class GaussianBlurMaterial extends BlitMaterial {
    constructor(kernel_radius: any);
    set_size(w: any, h: any): void;
    set_direction(x: any, y: any): void;
    set_radius(value?: number): void;
}
import { BlitMaterial } from "./BlitMaterial";
