export default class ParticleAttribute {
    constructor(attr_name: any);
    read: any;
    write: any;
    name: any;
    update_material: any;
    update_scene: any;
    init_from_geometry(geometry: any): void;
    init_from_attribute(particle_attribute: any): void;
    build_RT(particle_count: any): any;
    calculate_resolution(particle_count: any): number;
    swap_RT(): void;
    update(): void;
    render_geometry_to_RT(geometry: any, material: any, RT: any): void;
}
