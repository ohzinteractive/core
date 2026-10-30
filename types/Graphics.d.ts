import { BaseRender } from './render_mode/BaseRender';
import { Blitter } from './render_utilities/Blitter';
import { DepthAndNormalsRenderer } from './render_utilities/DepthAndNormalsRenderer';
import { type Material, type RenderTarget, type Scene, type TypedArray } from 'three';
import type { Renderer } from 'three/webgpu';
import type { OrthographicCamera } from './OrthographicCamera';
import type { PerspectiveCamera } from './PerspectiveCamera';
import type { AbstractScene } from './scenes/AbstractScene';
export interface CoreAttributes {
    xr_enabled: boolean;
}
declare class Graphics {
    _renderer: Renderer;
    blitter: Blitter;
    canvas: HTMLCanvasElement;
    core_attributes: CoreAttributes;
    current_render_mode: BaseRender;
    depth_and_normals_renderer: DepthAndNormalsRenderer;
    generate_depth_normal_texture: boolean;
    no_render: BaseRender;
    init({ renderer, core_attributes, dpr }: {
        renderer: Renderer;
        core_attributes: CoreAttributes;
        dpr: number;
    }): void;
    get dom_element(): HTMLCanvasElement;
    get depth_normals_RT(): RenderTarget;
    set_state(new_state: BaseRender): void;
    update(): void;
    __update_current_camera(): void;
    render(scene?: Scene, camera?: PerspectiveCamera | OrthographicCamera, RT?: RenderTarget, override_mat?: Material): void;
    compile(scene: AbstractScene, camera: PerspectiveCamera, RT: RenderTarget, override_mat: Material): Promise<void>;
    compile_async(scene: AbstractScene, camera: PerspectiveCamera, RT: RenderTarget, override_mat: Material, target_scene: Scene): Promise<void>;
    render_scene(scene: AbstractScene | {
        render: () => void;
    }): void;
    __apply_override_material(scene: Scene, mat: Material): void;
    readback_RT(RT: RenderTarget): Promise<TypedArray>;
    clear(RT: RenderTarget, camera: PerspectiveCamera, clear_depth: boolean, clear_stencil: boolean): void;
    on_resize(entries: ResizeObserverEntry[], dpr: number): void;
    material_pass(mat: Material, dst?: RenderTarget): void;
    blit(src_RT: RenderTarget, dst_RT: RenderTarget, mat?: Material): void;
    blit_clear_with_material(dst_RT: RenderTarget, mat: Material): void;
    take_screenshot(blob_callback: BlobCallback, width?: number, height?: number): void;
    download_screenshot(blob: Blob): void;
    dispose(): void;
}
declare const graphics: Graphics;
export { graphics as Graphics };
