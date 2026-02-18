import type { InstancedBufferAttribute, Mesh, Points, Scene } from "three";
import { Object3D } from "three";

export class GPUParticleSystem extends Object3D {
    constructor(particle_count: any, material: any);
    attributes: any[];
    mesh: Mesh;
    attribute_writter_mesh: Points;
    attribute_writter_scene: Scene;

    add_texture_attribute(buffer_attribute: any): void;
    add_update_attribute_array(name: any, array: any, item_size: any): void;
    add_attribute_array(name: any, array: any, item_size: any): void;
    update(): void;
    dispose(): void;
    build_point_mesh(instance_count: number, material: any): Mesh;
    build_attribute_writter_mesh(particle_count: any): Points;
    build_uv_storage_attribute(particle_count: any): InstancedBufferAttribute;
}
