export class DeferredRender extends BaseRender {
    compose_mat: DeferredRendererComposeMaterial;
    main_rt: WebGLRenderTarget<import("three").Texture>;
    scene_lights: Scene;
    camera_inverse_proj_mat: Matrix4;
    on_enter(): void;
    __check_RT_size(): void;
}
import { BaseRender } from "../render_mode/BaseRender";
import { DeferredRendererComposeMaterial } from "../materials/DeferredRendererComposeMaterial";
import { WebGLRenderTarget } from "three/src/renderers/WebGLRenderTarget";
import { Scene } from "three/src/scenes/Scene";
import { Matrix4 } from "three/src/math/Matrix4";
