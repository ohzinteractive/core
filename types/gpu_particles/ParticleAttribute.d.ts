export class ParticleAttribute {
    static calculate_resolution(particle_count: any): {
        width: number;
        height: number;
    };
    constructor(attr_name: any, update_material: any);
    read: any;
    write: any;
    name: any;
    update_material: any;
    init_from_geometry(geometry: any): void;
    init_from_attribute(particle_attribute: any): void;
    build_RT(particle_count: any): WebGLRenderTarget<import("three").Texture>;
    swap_RT(): void;
    update(attribute_writter_scene: any): void;
    store_geometry_attribute_in_RT(attribute: any, RT: any, storage_material: any, attribute_writter_scene: any): void;
    get_texture(): any;
}
import { WebGLRenderTarget } from "three/src/renderers/WebGLRenderTarget";
