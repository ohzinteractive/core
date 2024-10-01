export { debug as Debug };
declare const debug: Debug;
declare class Debug {
    init(): void;
    Vector3_one: Vector3;
    Vector3_zero: Vector3;
    canvas_renderer: any;
    /** @type { Mesh<PlaneGeometry, ScreenSpaceTextureMaterial>[] } */
    display_texture_meshes: Mesh<PlaneGeometry, ScreenSpaceTextureMaterial>[];
    ctx: any;
    scene: Scene;
    camera: PerspectiveCamera;
    /**
     * @param {Vector3} origin
     * @param {Vector3} dir
     * @param {number | string} color
     * @returns {Arrow}
     */
    draw_arrow(origin: Vector3, dir: Vector3, color?: number | string): Arrow;
    draw_axis(): AxisHelper;
    /**
     * @param {RenderTarget} RT
     */
    set_debug_RT(RT: RenderTarget): void;
    rt_debug: RenderTarget<Texture>;
    /**
     * @param {Vector2 | Vector3} position_2d
     * @param {number} width
     * @param {number} height
     * @param {number | string} color
     */
    draw_rectangle(position_2d: Vector2 | Vector3, width: number, height: number, color: number | string): void;
    clear(): void;
    /**
     * @param {Vector3 | Vector2} from
     * @param {Vector3 | Vector2} to
     * @param {number | string} color
     */
    draw_line_2D(from: Vector3 | Vector2, to: Vector3 | Vector2, color: number | string): void;
    /**
     * @param {Vector3[]} points
     * @param {number | string} color
     * @returns {Line}
     */
    draw_line(points: Vector3[], color?: number | string): Line;
    /**
     * @param {Vector3} pos
     * @param {number} size
     * @param {number | string} color
     * @returns {Cube}
     */
    draw_cube(pos: Vector3, size: number, color: number | string): Cube;
    /**
     * @param {Vector3} from
     * @param {Vector3} to
     * @param {number} height
     * @param {number | string} color
     * @param {number} depth
     * @returns {Cube}
     */
    draw_oriented_cube(from: Vector3, to: Vector3, height?: number, color?: number | string, depth?: number): Cube;
    /**
     *
     * @param {number} [width]
     * @param {number} [height]
     * @param {number | string} [color]
     * @returns
     */
    draw_plane(width?: number, height?: number, color?: number | string): Mesh<PlaneGeometry, ShaderMaterial, import("three").Object3DEventMap>;
    /**
     * @param {Vector3} pos
     * @param {number} size
     * @param {number | string} color
     * @returns {Box3Helper}
     */
    draw_empty_cube(pos: Vector3, size: number, color: number | string): Box3Helper;
    /**
     * @param {Vector3} pos
     * @param {number} size
     * @param {number | string} color
     * @returns {Sphere}
     */
    draw_sphere(pos: Vector3, size: number, color: number | string): Sphere;
    /**
     *
     * @param {Vector3[]} input_points
     * @param {boolean} open
     * @param {number | string} color
     * @returns {Line}
     */
    draw_point_array(input_points: Vector3[], open?: boolean, color?: number | string): Line;
    /**
     * @param {Sphere} sphere
     * @param {number | string} color
     * @returns {Mesh}
     */
    draw_sphere_helper(sphere: Sphere, color: number | string): Mesh;
    /**
     * @param {Sphere} sphere
     */
    draw_math_sphere(sphere: Sphere): void;
    /**
     * @param {Box3} bb
     */
    draw_bounding_box(bb: Box3): void;
    /**
     * @param {Vector3[]} curve
     * @param {object} options
     * @param {number} options.offset
     */
    draw_curve(curve: Vector3[], options: {
        offset: number;
    }): void;
    /**
     * @param {Texture} tex
     * @param {number} w
     * @param {number} h
     * @returns {Mesh}
     */
    draw_texture(tex: Texture, w: number, h: number): Mesh;
    /**
     * @param {Graphics} graphics
     */
    render(graphics: {
        init({ canvas, core_attributes, context_attributes, threejs_attributes, dpr }: {
            canvas: HTMLCanvasElement;
            core_attributes: Record<string, any>;
            context_attributes: Record<string, any>;
            threejs_attributes: Record<string, any>;
            dpr: number;
        }): void;
        _renderer: WebGLRenderer;
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
        readonly depth_normals_RT: import("three").WebGLRenderTarget<Texture>;
        set_state(new_state: import("./render_mode/BaseRender").BaseRender): void;
        update(): void;
        __update_current_camera(): void;
        render(scene?: Scene, camera?: PerspectiveCamera | import("./OrthographicCamera").OrthographicCamera, RT?: import("three").WebGLRenderTarget<Texture>, override_mat?: import("three").Material): void;
        compile(scene: Scene, camera: PerspectiveCamera, RT: import("three").WebGLRenderTarget<Texture>, override_mat: import("three").Material): void;
        compile_async(scene: Scene, camera: PerspectiveCamera, RT: import("three").WebGLRenderTarget<Texture>, override_mat: import("three").Material, target_scene: Scene): Promise<import("three").Object3D<import("three").Object3DEventMap>>;
        render_scene(scene: Scene | import("./BaseApplication").BaseApplication | {
            render: () => void;
        }): void;
        __apply_override_material(scene: Scene, mat: import("three").Material): void;
        readback_RT(RT: import("three").WebGLRenderTarget<Texture>, buffer: import("three").TypedArray): void;
        clear(RT: import("three").WebGLRenderTarget<Texture>, camera: PerspectiveCamera, clear_depth: boolean, clear_stencil: boolean): void;
        on_resize(entries: ResizeObserverEntry[], dpr: number): void;
        material_pass(mat: import("three").Material, dst: import("three").WebGLRenderTarget<Texture>): void;
        blit(src_RT: import("three").WebGLRenderTarget<Texture>, dst_RT: import("three").WebGLRenderTarget<Texture>, mat: import("three").Material): void;
        blit_clear_with_material(dst_RT: import("three").WebGLRenderTarget<Texture>, mat: import("three").Material): void;
        take_screenshot(blob_callback: BlobCallback, width?: number, height?: number): void;
        download_screenshot(blob: Blob): void;
        dispose(): void;
        is_floating_point_texture_available(): boolean;
    }): void;
}
import { Vector3 } from "three/src/math/Vector3";
import { Mesh } from "three/src/objects/Mesh";
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry";
import { ScreenSpaceTextureMaterial } from "./materials/ScreenSpaceTextureMaterial";
import { Scene } from "three/src/scenes/Scene";
import { PerspectiveCamera } from "./PerspectiveCamera";
import { Arrow } from "./primitives/Arrow";
import { AxisHelper } from "./components/AxisHelper";
import { RenderTarget } from "three/src/core/RenderTarget";
import { Texture } from "three/src/textures/Texture";
import { Vector2 } from "three/src/math/Vector2";
import { Line } from "three/src/objects/Line";
import { Cube } from "./primitives/Cube";
import { ShaderMaterial } from "three/src/materials/ShaderMaterial";
import { Box3Helper } from "three/src/helpers/Box3Helper";
import { Sphere } from "./primitives/Sphere";
import { Box3 } from "three/src/math/Box3";
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
