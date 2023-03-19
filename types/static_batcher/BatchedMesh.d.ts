export class BatchedMesh {
    constructor(id_table: any, geometry: any, material: any, max_texture_width: any);
    id_table: any;
    batched_count: number;
    max_texture_width: any;
    batch_width: number;
    batch_height: number;
    attach_rgb_texture(uniform_name: any): void;
    attach_rgba_texture(uniform_name: any): void;
    attach_rgb_float_texture(uniform_name: any): void;
    attach_rgba_float_texture(uniform_name: any): void;
    get_mesh_index(name: any): any;
    set_rgb_value(uniform_name: any, mesh_name: any, r: any, g: any, b: any): void;
    set_rgba_value(uniform_name: any, mesh_name: any, r: any, g: any, b: any, a: any): void;
}
