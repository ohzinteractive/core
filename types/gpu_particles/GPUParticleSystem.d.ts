export class GPUParticleSystem extends Object3D<import("three").Object3DEventMap> {
    constructor(particle_count: any, material: any);
    attributes: any[];
    mesh: Mesh<InstancedBufferGeometry, any, import("three").Object3DEventMap>;
    attribute_writter_mesh: Points<BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material | import("three").Material[], import("three").Object3DEventMap>;
    attribute_writter_scene: Scene;
    add_texture_attribute(buffer_attribute: any): void;
    add_update_attribute_array(name: any, array: any, item_size: any): void;
    add_attribute_array(name: any, array: any, item_size: any): void;
    update(): void;
    dispose(): void;
    build_point_mesh(instance_count: number, material: any): Mesh<InstancedBufferGeometry, any, import("three").Object3DEventMap>;
    build_attribute_writter_mesh(particle_count: any): Points<BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material | import("three").Material[], import("three").Object3DEventMap>;
    build_uv_storage_attribute(particle_count: any): InstancedBufferAttribute;
}
import { Object3D } from "three/src/core/Object3D";
import { InstancedBufferGeometry } from "three/src/core/InstancedBufferGeometry";
import { Mesh } from "three/src/objects/Mesh";
import { BufferGeometry } from "three/src/core/BufferGeometry";
import { Points } from "three/src/objects/Points";
import { Scene } from "three/src/scenes/Scene";
import { InstancedBufferAttribute } from "three/src/core/InstancedBufferAttribute";
