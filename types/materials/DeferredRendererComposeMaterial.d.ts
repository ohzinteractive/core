export default class DeferredRendererComposeMaterial extends BlitMaterial {
    constructor();
    set_normal_depth_rt(rt: any): void;
    set_albedo_rt(tex: any): void;
    set_proj_matrix(mat4: any): void;
}
import BlitMaterial from "../materials/BlitMaterial";
