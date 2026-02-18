import type { RenderTarget, Texture } from "three";
import type { ClearDepthNormalMaterial } from "../materials/ClearDepthNormalMaterial";
import type { DepthNormalMaterial } from "../materials/DepthNormalMaterial";

export class DepthAndNormalsRenderer {
    RT: RenderTarget<Texture>;
    clear_depth_normal_mat: ClearDepthNormalMaterial;
    depth_normal_material: DepthNormalMaterial;
    render(graphics: any): void;
    __resize_RT_if_necessary(): void;
    get render_target(): RenderTarget<Texture>;
}
