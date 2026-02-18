import type { ShaderMaterial, Texture, Vector2, Vector3 } from "three";
import { Mesh } from "three";

export class WorldImage extends Mesh {
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
