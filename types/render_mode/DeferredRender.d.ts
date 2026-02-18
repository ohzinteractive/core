import { RenderTarget, Texture } from "three";
import { Matrix4 } from "three";
import { Scene } from "three;
import { DeferredRendererComposeMaterial } from "../materials/DeferredRendererComposeMaterial";
import { BaseRender } from "../render_mode/BaseRender";

export class DeferredRender extends BaseRender {
    compose_mat: DeferredRendererComposeMaterial;
    main_rt: RenderTarget<Texture>;
    scene_lights: Scene;
    camera_inverse_proj_mat: Matrix4;
    on_enter(): void;
    __check_RT_size(): void;
}

