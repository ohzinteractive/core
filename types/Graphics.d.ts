export { graphics as Graphics };
declare const graphics: Graphics;
declare class Graphics {
    init({ canvas, core_attributes, context_attributes, threejs_attributes, dpr }: {
        canvas: any;
        core_attributes: any;
        context_attributes: any;
        threejs_attributes: any;
        dpr: any;
    }): void;
    _renderer: any;
    blitter: Blitter;
    canvas: any;
    no_render: BaseRender;
    current_render_mode: any;
    generateDepthNormalTexture: boolean;
    depth_and_normals_renderer: DepthAndNormalsRenderer;
    is_webgl2: boolean;
    canvas_context: any;
    context_attributes: {
        alpha: boolean;
        antialias: boolean;
        depth: boolean;
        desynchronized: boolean;
        failIfMajorPerformanceCaveat: boolean;
        powerPreference: string;
        premultipliedAlpha: boolean;
        preserveDrawingBuffer: boolean;
        stencil: boolean;
    };
    core_attributes: {
        force_webgl2: boolean;
        xr_enabled: boolean;
    };
    threejs_attributes: {
        logarithmicDepthBuffer: boolean;
    };
    get dom_element(): any;
    get depth_normals_RT(): any;
    set_state(new_state: any): void;
    update(): void;
    __update_current_camera(): void;
    render(scene: any, camera: any, RT: any, override_mat: any): void;
    render_scene(scene: any): void;
    __apply_override_material(scene: any, mat: any): void;
    readback_RT(RT: any, buffer: any): void;
    clear(RT: any, camera: any, clear_depth: any, clear_stencil: any): void;
    on_resize(entries: any, dpr: any): void;
    material_pass(mat: any, dst: any): void;
    blit(src_RT: any, dst_RT: any, mat: any): void;
    blit_clear_with_material(dst_RT: any, mat: any): void;
    take_screenshot(blob_callback: any, width?: any, height?: any): void;
    download_screenshot(blob: any): void;
    dispose(): void;
    is_floating_point_texture_available(): boolean;
}
import { Blitter } from "./render_utilities/Blitter";
import { BaseRender } from "./render_mode/BaseRender";
import { DepthAndNormalsRenderer } from "./render_utilities/DepthAndNormalsRenderer";
