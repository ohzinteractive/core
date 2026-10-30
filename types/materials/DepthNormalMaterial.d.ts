import { NodeMaterial } from 'three/webgpu';
declare class DepthNormalMaterial extends NodeMaterial {
    uniforms: {
        _FarPlane: {
            value: number;
        };
    };
    constructor();
    set far_plane(value: number);
    get far_plane(): number;
}
export { DepthNormalMaterial };
