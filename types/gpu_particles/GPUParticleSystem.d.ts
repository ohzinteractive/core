export class GPUParticleSystem {
    attributes: any[];
    particles: any;
    set_from_geometry(geometry: any, material: any, init_attribute_uvs: any): void;
    add_texture_attribute(buffer_attribute: any): void;
    add_attribute(name: any, buffer_attribute: any): void;
    build_uv_storage_attribute(particle_count: any): any;
    calculate_resolution(particle_count: any): number;
    update(): void;
    set_attribute_update_material(attribute_name: any, mat: any): void;
    dispose(): void;
}
