import { BaseShaderMaterial } from '../../materials/BaseShaderMaterial';
import type { RenderTarget } from 'three';
import { Matrix4 } from 'three';
declare class DeferredPointLightMaterial extends BaseShaderMaterial {
    constructor(intensity?: number);
    set_inverse_proj_matrix(mat4: Matrix4): void;
    set_normal_depth_rt(rt: RenderTarget): void;
    set_albedo_rt(rt: RenderTarget): void;
}
export { DeferredPointLightMaterial };
