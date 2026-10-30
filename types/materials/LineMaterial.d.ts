import { Color } from 'three';
import { NodeMaterial } from 'three/webgpu';
declare class LineMaterial extends NodeMaterial {
    uniforms: {
        _Thickness: {
            value: number;
        };
        _Length: {
            value: number;
        };
        _ElapsedTime: {
            value: number;
        };
        _Color: {
            value: Color;
        };
    };
    constructor();
}
export { LineMaterial };
