import { DataTexture } from 'three';
declare class CustomDataTexture extends DataTexture {
    data: any;
    multiplier: number;
    constructor(data: any, width: number, height: number, format: any, type?: any);
    set_rgba(index: number, r: number, g: number, b: number, a: number): void;
    set_rgb(index: number, r: number, g: number, b: number): void;
    set_r(index: number, value: number): void;
    set_g(index: number, value: number): void;
    set_b(index: number, value: number): void;
    set_a(index: number, value: number): void;
}
export { CustomDataTexture };
