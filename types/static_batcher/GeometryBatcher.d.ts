export { geometry_batcher as GeometryBatcher };
declare const geometry_batcher: GeometryBatcher;
declare class GeometryBatcher {
    init(): void;
    batches: any[];
    batch(buffer_geometries: any): any;
    upload_texture_data(renderer: any): void;
    __init_uv_array(uvs: any, texture_width: any): void;
}
