export { screen as Screen };
declare const screen: Screen;
declare class Screen {
    init(): void;
    update_position(x: any, y: any): void;
    update(): void;
    update_size(width: any, height: any): void;
    apply_pixel_density_v2(vector2: any): any;
    apply_pixel_density(value: any): number;
    get_pixel_size(): any;
    get aspect_ratio(): number;
}
