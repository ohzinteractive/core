import { WorldImageMaterial } from '../materials/WorldImageMaterial';
import type { Texture } from 'three';
import { Mesh, Vector2, Vector3 } from 'three';
declare class WorldImage extends Mesh {
    current_scale: number;
    sized_texture: Texture;
    texture_size: Vector2;
    tmp_bb_size: Vector3;
    material: WorldImageMaterial;
    constructor(texture: Texture, pivot: Vector2);
    update_texture(): void;
    get size(): Vector3;
    set size(value: Vector3);
    set screen_aligned(boolean: boolean);
    get screen_aligned(): boolean;
    set opacity(opacity: number);
    get opacity(): number;
    dispose(): void;
}
export { WorldImage };
