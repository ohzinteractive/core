import type { Material, Object3D, RenderTarget, Scene, Texture, TypedArray } from "three";
import type { Renderer } from "three/webgpu";
import type { BaseApplication } from "./BaseApplication";
import type { OrthographicCamera } from "./OrthographicCamera";
import type { PerspectiveCamera } from "./PerspectiveCamera";
import type { BaseRender } from "./render_mode/BaseRender";
import type { Blitter } from "./render_utilities/Blitter";
import type { DepthAndNormalsRenderer } from "./render_utilities/DepthAndNormalsRenderer";

export { graphics as Graphics };
declare const graphics: Graphics;
declare class Graphics {
    init({ core_attributes, renderer_attributes, dpr }: {
        core_attributes: Record<string, any>;
        renderer_attributes: Record<string, any>;
        dpr: number;
    }): void;
    _renderer: Renderer;
    blitter: Blitter;
    no_render: BaseRender;
    current_render_mode: BaseRender;
    generateDepthNormalTexture: boolean;
    depth_and_normals_renderer: DepthAndNormalsRenderer;
    is_webgl2: boolean;
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
    get dom_element(): HTMLCanvasElement;
    get depth_normals_RT(): RenderTarget<Texture>;

    set_state(new_state: BaseRender): void;
    update(): void;
    __update_current_camera(): void;
    render(scene?: Scene, camera?: PerspectiveCamera | OrthographicCamera, RT?: RenderTarget, override_mat?: Material): void;
    compile(scene: Scene, camera: PerspectiveCamera, RT: RenderTarget, override_mat: Material): void;
    compile_async(scene: Scene, camera: PerspectiveCamera, RT: RenderTarget, override_mat: Material, target_scene: Scene): Promise<Object3D>;
    render_scene(scene: BaseApplication | Scene | {
        render: () => void;
    }): void;
    __apply_override_material(scene: Scene, mat: Material): void;
    readback_RT(RT: RenderTarget, buffer: TypedArray): void;
    clear(RT: RenderTarget, camera: PerspectiveCamera, clear_depth: boolean, clear_stencil: boolean): void;
    on_resize(entries: ResizeObserverEntry[], dpr: number): void;
    material_pass(mat: Material, dst: RenderTarget): void;
    blit(src_RT: RenderTarget, dst_RT: RenderTarget, mat: Material): void;
    blit_clear_with_material(dst_RT: RenderTarget, mat: Material): void;
    take_screenshot(blob_callback: BlobCallback, width?: number, height?: number): void;
    download_screenshot(blob: Blob): void;
    dispose(): void;
    is_floating_point_texture_available(): boolean;
}
