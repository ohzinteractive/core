export class WorldImage extends Mesh<import("three").BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material | import("three").Material[], import("three").Object3DEventMap> {
    /**
     * @param {Texture} texture
     * @param {Vector2} [pivot]
     */
    constructor(texture: Texture, pivot?: Vector2);
    current_scale: number;
    tmp_bb_size: Vector3;
    material: ShaderMaterial;
    update_texture(): void;
    set size(arg: Vector3);
    get size(): Vector3;
    set screen_aligned(arg: boolean);
    get screen_aligned(): boolean;
    set opacity(arg: any);
    get opacity(): any;
    dispose(): void;
}
import { Mesh } from "three/src/objects/Mesh";
import { Vector3 } from "three/src/math/Vector3";
import { ShaderMaterial } from "three/src/materials/ShaderMaterial";
import { Texture } from "three/src/textures/Texture";
import { Vector2 } from "three/src/math/Vector2";
