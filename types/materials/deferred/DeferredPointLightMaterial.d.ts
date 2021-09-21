export default class DeferredPointLightMaterial extends BaseShaderMaterial {
    constructor(intensity?: number);
    blending: any;
    depthWrite: boolean;
    side: any;
    set_inverse_proj_matrix(mat4: any): void;
    set_normal_depth_rt(rt: any): void;
    set_albedo_rt(rt: any): void;
}
import BaseShaderMaterial from "../../materials/BaseShaderMaterial";
