import { RenderTarget } from 'three';
import type { Graphics } from '../Graphics';
declare class DepthAndNormalsRenderer {
    RT: RenderTarget;
    clear_depth_normal_mat: any;
    depth_normal_material: any;
    constructor();
    render(graphics: typeof Graphics): void;
    __resize_RT_if_necessary(): void;
    get render_target(): RenderTarget<import("three").Texture<unknown, import("three").TextureEventMap>, import("three").RenderTargetEventMap>;
}
export { DepthAndNormalsRenderer };
