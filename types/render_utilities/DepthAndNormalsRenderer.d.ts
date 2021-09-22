import { ClearDepthNormalMaterial } from "../materials/ClearDepthNormalMaterial";
import { DepthNormalMaterial } from "../materials/DepthNormalMaterial";

export class DepthAndNormalsRenderer {
    RT: any;
    clear_depth_normal_mat: ClearDepthNormalMaterial;
    depth_normal_material: DepthNormalMaterial;
    render(graphics: any): void;
    __resize_RT_if_necessary(): void;
    get render_target(): any;
}

