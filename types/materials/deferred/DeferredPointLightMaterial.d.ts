import type { RenderTarget } from 'three';
import { Matrix4 } from 'three';
import { NodeMaterial } from 'three/webgpu';
declare class DeferredPointLightMaterial extends NodeMaterial {
    constructor(intensity?: number);
    set_inverse_proj_matrix(mat4: Matrix4): void;
    set_normal_depth_rt(rt: RenderTarget): void;
    set_albedo_rt(rt: RenderTarget): void;
}
export { DeferredPointLightMaterial };
