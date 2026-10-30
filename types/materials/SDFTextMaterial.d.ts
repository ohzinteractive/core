import type { Texture } from 'three';
import { Vector2 } from 'three';
import { NodeMaterial } from 'three/webgpu';
declare class SDFTextMaterial extends NodeMaterial {
    uniforms: {
        _Texture: {
            value: Texture;
        };
        _Boldness: {
            value: number;
        };
        _AtlasSize: {
            value: Vector2;
        };
    };
    constructor(atlas: Texture);
    set_atlas_size(size: Vector2): void;
    set_boldness(value: number): void;
}
export { SDFTextMaterial };
