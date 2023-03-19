export class GPUParticleSystem {
    constructor(particle_count: any, material: any);
    attributes: any[];
    mesh: any;
    attribute_writter_mesh: any;
    attribute_writter_scene: any;
    add_texture_attribute(buffer_attribute: any): void;
    add_update_attribute_array(name: any, array: any, item_size: any): void;
    add_attribute_array(name: any, array: any, item_size: any): void;
    update(): void;
    dispose(): void;
    build_point_mesh(instance_count: number, material: any): any;
    build_attribute_writter_mesh(particle_count: any): any;
    build_uv_storage_attribute(particle_count: any): any;
}
