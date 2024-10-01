export class RenderLoop {
    /**
     * @param {BaseApplication} target_application
     * @param {Graphics} graphics
     */
    constructor(target_application: BaseApplication, graphics: {
        init({ canvas, core_attributes, context_attributes, threejs_attributes, dpr }: {
            canvas: HTMLCanvasElement;
            core_attributes: Record<string, any>;
            context_attributes: Record<string, any>;
            threejs_attributes: Record<string, any>;
            dpr: number;
        }): void;
        _renderer: import("three").WebGLRenderer;
        blitter: import("./render_utilities/Blitter").Blitter;
        canvas: HTMLCanvasElement;
        no_render: import("./render_mode/BaseRender").BaseRender;
        current_render_mode: import("./render_mode/BaseRender").BaseRender;
        generateDepthNormalTexture: boolean;
        depth_and_normals_renderer: import("./render_utilities/DepthAndNormalsRenderer").DepthAndNormalsRenderer;
        is_webgl2: boolean;
        canvas_context: RenderingContext;
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
        threejs_attributes: Record<string, any>;
        readonly dom_element: HTMLCanvasElement;
        readonly depth_normals_RT: import("three").WebGLRenderTarget<import("three").Texture>;
        set_state(new_state: import("./render_mode/BaseRender").BaseRender): void;
        update(): void;
        __update_current_camera(): void;
        render(scene?: import("three").Scene, camera?: import("./PerspectiveCamera").PerspectiveCamera | import("./OrthographicCamera").OrthographicCamera, RT?: import("three").WebGLRenderTarget<import("three").Texture>, override_mat?: import("three").Material): void;
        compile(scene: import("three").Scene, camera: import("./PerspectiveCamera").PerspectiveCamera, RT: import("three").WebGLRenderTarget<import("three").Texture>, override_mat: import("three").Material): void;
        compile_async(scene: import("three").Scene, camera: import("./PerspectiveCamera").PerspectiveCamera, RT: import("three").WebGLRenderTarget<import("three").Texture>, override_mat: import("three").Material, target_scene: import("three").Scene): Promise<import("three").Object3D<import("three").Object3DEventMap>>;
        render_scene(scene: import("three").Scene | BaseApplication | {
            render: () => void;
        }): void;
        __apply_override_material(scene: import("three").Scene, mat: import("three").Material): void;
        readback_RT(RT: import("three").WebGLRenderTarget<import("three").Texture>, buffer: import("three").TypedArray): void;
        clear(RT: import("three").WebGLRenderTarget<import("three").Texture>, camera: import("./PerspectiveCamera").PerspectiveCamera, clear_depth: boolean, clear_stencil: boolean): void;
        on_resize(entries: ResizeObserverEntry[], dpr: number): void;
        material_pass(mat: import("three").Material, dst: import("three").WebGLRenderTarget<import("three").Texture>): void;
        blit(src_RT: import("three").WebGLRenderTarget<import("three").Texture>, dst_RT: import("three").WebGLRenderTarget<import("three").Texture>, mat: import("three").Material): void;
        blit_clear_with_material(dst_RT: import("three").WebGLRenderTarget<import("three").Texture>, mat: import("three").Material): void;
        take_screenshot(blob_callback: BlobCallback, width?: number, height?: number): void;
        download_screenshot(blob: Blob): void;
        dispose(): void;
        is_floating_point_texture_available(): boolean;
    }, input: any);
    target_application: BaseApplication;
    graphics: {
        init({ canvas, core_attributes, context_attributes, threejs_attributes, dpr }: {
            canvas: HTMLCanvasElement;
            core_attributes: Record<string, any>;
            context_attributes: Record<string, any>;
            threejs_attributes: Record<string, any>;
            dpr: number;
        }): void;
        _renderer: import("three").WebGLRenderer;
        blitter: import("./render_utilities/Blitter").Blitter;
        canvas: HTMLCanvasElement;
        no_render: import("./render_mode/BaseRender").BaseRender;
        current_render_mode: import("./render_mode/BaseRender").BaseRender;
        generateDepthNormalTexture: boolean;
        depth_and_normals_renderer: import("./render_utilities/DepthAndNormalsRenderer").DepthAndNormalsRenderer;
        is_webgl2: boolean;
        canvas_context: RenderingContext;
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
        threejs_attributes: Record<string, any>;
        readonly dom_element: HTMLCanvasElement;
        readonly depth_normals_RT: import("three").WebGLRenderTarget<import("three").Texture>;
        set_state(new_state: import("./render_mode/BaseRender").BaseRender): void;
        update(): void;
        __update_current_camera(): void;
        render(scene?: import("three").Scene, camera?: import("./PerspectiveCamera").PerspectiveCamera | import("./OrthographicCamera").OrthographicCamera, RT?: import("three").WebGLRenderTarget<import("three").Texture>, override_mat?: import("three").Material): void;
        compile(scene: import("three").Scene, camera: import("./PerspectiveCamera").PerspectiveCamera, RT: import("three").WebGLRenderTarget<import("three").Texture>, override_mat: import("three").Material): void;
        compile_async(scene: import("three").Scene, camera: import("./PerspectiveCamera").PerspectiveCamera, RT: import("three").WebGLRenderTarget<import("three").Texture>, override_mat: import("three").Material, target_scene: import("three").Scene): Promise<import("three").Object3D<import("three").Object3DEventMap>>;
        render_scene(scene: import("three").Scene | BaseApplication | {
            render: () => void;
        }): void;
        __apply_override_material(scene: import("three").Scene, mat: import("three").Material): void;
        readback_RT(RT: import("three").WebGLRenderTarget<import("three").Texture>, buffer: import("three").TypedArray): void;
        clear(RT: import("three").WebGLRenderTarget<import("three").Texture>, camera: import("./PerspectiveCamera").PerspectiveCamera, clear_depth: boolean, clear_stencil: boolean): void;
        on_resize(entries: ResizeObserverEntry[], dpr: number): void;
        material_pass(mat: import("three").Material, dst: import("three").WebGLRenderTarget<import("three").Texture>): void;
        blit(src_RT: import("three").WebGLRenderTarget<import("three").Texture>, dst_RT: import("three").WebGLRenderTarget<import("three").Texture>, mat: import("three").Material): void;
        blit_clear_with_material(dst_RT: import("three").WebGLRenderTarget<import("three").Texture>, mat: import("three").Material): void;
        take_screenshot(blob_callback: BlobCallback, width?: number, height?: number): void;
        download_screenshot(blob: Blob): void;
        dispose(): void;
        is_floating_point_texture_available(): boolean;
    };
    input: any;
    is_running: boolean;
    frames_passed: number;
    time_accumulator: number;
    update(): void;
    start(): void;
    stop(): void;
    /**
     * @param {BaseApplication} new_state
     */
    set_state(new_state: BaseApplication): void;
    dispose(): void;
}
import { BaseApplication } from "./BaseApplication";
