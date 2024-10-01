export class DepthAndNormalsRenderer {
    RT: WebGLRenderTarget<import("three").Texture>;
    clear_depth_normal_mat: ClearDepthNormalMaterial;
    depth_normal_material: DepthNormalMaterial;
    render(graphics: any): void;
    __resize_RT_if_necessary(): void;
    get render_target(): WebGLRenderTarget<import("three").Texture>;
}
import { WebGLRenderTarget } from "three/src/renderers/WebGLRenderTarget";
import { ClearDepthNormalMaterial } from "../materials/ClearDepthNormalMaterial";
import { DepthNormalMaterial } from "../materials/DepthNormalMaterial";
