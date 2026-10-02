import { BlitNodeMaterial } from './BlitNodeMaterial';
declare class GaussianBlurMaterial extends BlitNodeMaterial {
    constructor(kernel_radius: number);
    set_size(w: number, h: number): void;
    set_direction(x: number, y: number): void;
    set_radius(value?: number): void;
}
export { GaussianBlurMaterial };
