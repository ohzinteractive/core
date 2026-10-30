import type { Texture } from 'three';
import { Vector3 } from 'three';
import { NodeMaterial } from 'three/webgpu';
declare class WorldImageMaterial extends NodeMaterial {
    uniforms: {
        _MainTex: {
            value: Texture;
        };
        _ScreenAligned: {
            value: number;
        };
        _Scale: {
            value: Vector3;
        };
        _Opacity: {
            value: number;
        };
    };
    constructor(map: Texture);
}
export { WorldImageMaterial };
