export class DeferredRender extends BaseRender {
    compose_mat: DeferredRendererComposeMaterial;
    main_rt: any;
    scene_lights: any;
    camera_inverse_proj_mat: any;
    __check_RT_size(): void;
}
import { BaseRender } from "../render_mode/BaseRender";
import { DeferredRendererComposeMaterial } from "../materials/DeferredRendererComposeMaterial";
