export { graphics as Graphics };
declare const graphics: Graphics;
declare class Graphics {
    /**
     * @param {Object} options
     * @param {HTMLCanvasElement} options.canvas
     * @param {Record<string, any>} options.core_attributes
     * @param {Record<string, any>} options.context_attributes
     * @param {Record<string, any>} options.threejs_attributes
     * @param {number} options.dpr
     */
    init({ canvas, core_attributes, context_attributes, threejs_attributes, dpr }: {
        canvas: HTMLCanvasElement;
        core_attributes: Record<string, any>;
        context_attributes: Record<string, any>;
        threejs_attributes: Record<string, any>;
        dpr: number;
    }): void;
    _renderer: WebGLRenderer;
    blitter: Blitter;
    canvas: HTMLCanvasElement;
    no_render: BaseRender;
    current_render_mode: BaseRender;
    generateDepthNormalTexture: boolean;
    depth_and_normals_renderer: DepthAndNormalsRenderer;
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
    /** @type {Record<string, any>} */
    threejs_attributes: Record<string, any>;
    get dom_element(): HTMLCanvasElement;
    get depth_normals_RT(): WebGLRenderTarget<import("three").Texture>;
    /**
     * @param {BaseRender} new_state
     */
    set_state(new_state: BaseRender): void;
    update(): void;
    __update_current_camera(): void;
    /**
     * @param {Scene} [scene]
     * @param {PerspectiveCamera | OrthographicCamera} [camera]
     * @param {WebGLRenderTarget} [RT]
     * @param {Material} [override_mat]
     */
    render(scene?: Scene, camera?: PerspectiveCamera | OrthographicCamera, RT?: WebGLRenderTarget, override_mat?: Material): void;
    /**
     * @param {Scene} scene
     * @param {PerspectiveCamera} camera
     * @param {WebGLRenderTarget} RT
     * @param {Material} override_mat
     */
    compile(scene: Scene, camera: PerspectiveCamera, RT: WebGLRenderTarget, override_mat: Material): void;
    /**
     * @param {Scene} scene
     * @param {PerspectiveCamera} camera
     * @param {WebGLRenderTarget} RT
     * @param {Material} override_mat
     * @param {Scene} target_scene
     * @returns {Promise<Object3D>}
     */
    compile_async(scene: Scene, camera: PerspectiveCamera, RT: WebGLRenderTarget, override_mat: Material, target_scene: Scene): Promise<Object3D>;
    /**
     * @param {BaseApplication | Scene | {render:()=>void}} scene
     */
    render_scene(scene: BaseApplication | Scene | {
        render: () => void;
    }): void;
    /**
     * @param {Scene} scene
     * @param {Material} mat
     */
    __apply_override_material(scene: Scene, mat: Material): void;
    /**
     * @param {WebGLRenderTarget} RT
     * @param {import('three').TypedArray} buffer
     */
    readback_RT(RT: WebGLRenderTarget, buffer: import('three').TypedArray): void;
    /**
     * @param {WebGLRenderTarget} RT
     * @param {PerspectiveCamera} camera
     * @param {boolean} clear_depth
     * @param {boolean} clear_stencil
     */
    clear(RT: WebGLRenderTarget, camera: PerspectiveCamera, clear_depth: boolean, clear_stencil: boolean): void;
    /**
     * @param {ResizeObserverEntry[]} entries
     * @param {number} dpr
     */
    on_resize(entries: ResizeObserverEntry[], dpr: number): void;
    /**
     * @param {Material} mat
     * @param {WebGLRenderTarget} dst
     */
    material_pass(mat: Material, dst: WebGLRenderTarget): void;
    /**
     * @param {WebGLRenderTarget} src_RT
     * @param {WebGLRenderTarget} dst_RT
     * @param {Material} mat
     */
    blit(src_RT: WebGLRenderTarget, dst_RT: WebGLRenderTarget, mat: Material): void;
    /**
     * @param {WebGLRenderTarget} dst_RT
     * @param {Material} mat
     */
    blit_clear_with_material(dst_RT: WebGLRenderTarget, mat: Material): void;
    /**
     * @param {BlobCallback} blob_callback
     * @param {number} width
     * @param {number} height
     */
    take_screenshot(blob_callback: BlobCallback, width?: number, height?: number): void;
    /**
     * @param {Blob} blob
     */
    download_screenshot(blob: Blob): void;
    dispose(): void;
    is_floating_point_texture_available(): boolean;
}
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
import { Blitter } from "./render_utilities/Blitter";
import { BaseRender } from "./render_mode/BaseRender";
import { DepthAndNormalsRenderer } from "./render_utilities/DepthAndNormalsRenderer";
import { WebGLRenderTarget } from "three/src/renderers/WebGLRenderTarget";
import { Scene } from "three/src/scenes/Scene";
import { PerspectiveCamera } from "./PerspectiveCamera";
import { OrthographicCamera } from "./OrthographicCamera";
import { Material } from "three/src/materials/Material";
import { Object3D } from "three/src/core/Object3D";
import { BaseApplication } from "./BaseApplication";
