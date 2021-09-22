export class Screen {
    static init(): void;
    static width: any;
    static height: any;
    static position: any;
    static render_width: number;
    static render_height: number;
    static width_height: any;
    static dpr: number;
    static pixel_size: any;
    static update_position(x: any, y: any): void;
    static update_size(width: any, height: any): void;
    static apply_pixel_density_v2(vector2: any): any;
    static apply_pixel_density(value: any): number;
    static get_pixel_size(): any;
    static get aspect_ratio(): number;
}
