export class DeferredPointLightMaterial extends BaseShaderMaterial {
    constructor(intensity?: number);
    blending: 2;
    side: 1;
    set_inverse_proj_matrix(mat4: any): void;
    set_normal_depth_rt(rt: any): void;
    set_albedo_rt(rt: any): void;
}
import { BaseShaderMaterial } from "../../materials/BaseShaderMaterial";
