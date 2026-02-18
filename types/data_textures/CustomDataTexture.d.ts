import { DataTexture } from "three";
export class CustomDataTexture extends DataTexture {
    constructor(data: any, width: any, height: any, format: any, type: any);
    multiplier: number;
    set_rgba(index: any, r: any, g: any, b: any, a: any): void;
    set_rgb(index: any, r: any, g: any, b: any): void;
    set_r(index: any, value: any): void;
    set_g(index: any, value: any): void;
    set_b(index: any, value: any): void;
    set_a(index: any, value: any): void;
}
