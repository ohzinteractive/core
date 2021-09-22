
export class Graphics {
    static init(canvas: any, context_attributes: any): void;
    static _renderer: any;
    static blitter: Blitter;
    static canvas: any;
    static no_render: BaseRender;
    static current_render_mode: any;
    static generateDepthNormalTexture: boolean;
    static depth_and_normals_renderer: DepthAndNormalsRenderer;
    static is_webgl2: boolean;
    static canvas_context: any;
    static context_attributes: any;
    static get dom_element(): any;
    static get depth_normals_RT(): any;
    static set_state(new_state: any): void;
    static update(): void;
    static __update_current_camera(): void;
    static render(scene: any, camera: any, RT: any, override_mat: any): void;
    static render_scene(scene: any): void;
    static __apply_override_material(scene: any, mat: any): void;
    static readback_RT(RT: any, buffer: any): void;
    static clear(RT: any, camera: any, clear_depth: any, clear_stencil: any): void;
    static check_for_resize(): void;
    static on_resize(): void;
    static material_pass(mat: any, dst: any): void;
    static blit(src_RT: any, dst_RT: any, mat: any): void;
    static blit_clear_with_material(dst_RT: any, mat: any): void;
    static take_screenshot(blob_callback: any, width?: any, height?: any): void;
    static download_screenshot(blob: any): void;
    static dispose(): void;
}
import { BaseRender } from "ohzi-core";
import { Blitter } from "ohzi-core/types/render_utilities/Blitter";
import { DepthAndNormalsRenderer } from "ohzi-core/types/render_utilities/DepthAndNormalsRenderer";

