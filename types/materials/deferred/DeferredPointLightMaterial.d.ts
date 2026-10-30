import type { RenderTarget } from 'three';
import { Matrix4, Texture } from 'three';
import { NodeMaterial } from 'three/webgpu';
declare class DeferredPointLightMaterial extends NodeMaterial {
    uniforms: {
        _Intensity: {
            value: number;
        };
        _AlbedoTex: {
            value: Texture;
        };
        _NormalDepthTex: {
            value: Texture;
        };
        _InverseProjMatrix: {
            value: Matrix4;
        };
    };
    constructor(intensity?: number);
    set_inverse_proj_matrix(mat4: Matrix4): void;
    set_normal_depth_rt(rt: RenderTarget): void;
    set_albedo_rt(rt: RenderTarget): void;
}
export { DeferredPointLightMaterial };
