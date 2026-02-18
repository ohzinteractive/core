import { DeferredRendererComposeMaterial } from '../materials/DeferredRendererComposeMaterial';
import { BaseRender } from '../render_mode/BaseRender';
import { Matrix4, RenderTarget } from 'three';
import { AbstractScene } from '../scenes/AbstractScene';
declare class DeferredRender extends BaseRender {
    camera_inverse_proj_mat: Matrix4;
    compose_mat: DeferredRendererComposeMaterial;
    main_rt: RenderTarget;
    scene_lights: AbstractScene;
    constructor();
    on_enter(): void;
    render(): void;
    __check_RT_size(): void;
}
export { DeferredRender };
