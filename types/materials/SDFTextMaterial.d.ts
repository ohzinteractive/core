import { BaseShaderMaterial } from './BaseShaderMaterial';
import type { Texture } from 'three';
import { Vector2 } from 'three';
declare class SDFTextMaterial extends BaseShaderMaterial {
    constructor(texture: Texture);
    set_atlas_size(size: Vector2): void;
    set_boldness(value: number): void;
}
export { SDFTextMaterial };
