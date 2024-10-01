export { ui as UI };
declare const ui: UI;
declare class UI {
    init(input: any): void;
    input: any;
    /** @type {UIElement[]} */
    ui_elements: UIElement[];
    _tmp_normalized_pos: Vector2;
    ss_scene: Scene;
    ws_scene: Scene;
    ss_camera: OrthographicCamera;
    /**
     * @param {UIElement} elem
     */
    delete_element(elem: UIElement): void;
    /**
     * @param {UIElement} elem
     */
    add_screen_space_element(elem: UIElement): void;
    /**
     * @param {UIElement} elem
     */
    add_world_space_element(elem: UIElement): void;
    update(): void;
    /**
     * @param {Graphics} renderer
     */
    render(renderer: {
        init({ canvas, core_attributes, context_attributes, threejs_attributes, dpr }: {
            canvas: HTMLCanvasElement;
            core_attributes: Record<string, any>;
            context_attributes: Record<string, any>;
            threejs_attributes: Record<string, any>;
            dpr: number; /**
             * @param {UIElement} elem
             */
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
        render(scene?: Scene, camera?: import("./PerspectiveCamera").PerspectiveCamera | OrthographicCamera, RT?: import("three").WebGLRenderTarget<import("three").Texture>, override_mat?: import("three").Material): void;
        compile(scene: Scene, camera: import("./PerspectiveCamera").PerspectiveCamera, RT: import("three").WebGLRenderTarget<import("three").Texture>, override_mat: import("three").Material): void;
        compile_async(scene: Scene, camera: import("./PerspectiveCamera").PerspectiveCamera, RT: import("three").WebGLRenderTarget<import("three").Texture>, override_mat: import("three").Material, target_scene: Scene): Promise<import("three").Object3D<import("three").Object3DEventMap>>;
        render_scene(scene: Scene | import("./BaseApplication").BaseApplication | {
            render: () => void;
        }): void;
        __apply_override_material(scene: Scene, mat: import("three").Material): void;
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
    }): void;
    clear(): void;
    current_clicked_element: any;
}
import { UIElement } from "./components/UIElement";
import { Vector2 } from "three/src/math/Vector2";
import { Scene } from "three/src/scenes/Scene";
import { OrthographicCamera } from "./OrthographicCamera";
