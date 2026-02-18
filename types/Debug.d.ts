import type { Box3, Box3Helper, Line, Mesh, RenderTarget, Scene, Texture, Vector2, Vector3 } from "three";
import type { AxisHelper } from "./components/AxisHelper";
import type { Graphics } from "./Graphics";
import type { PerspectiveCamera } from "./PerspectiveCamera";
import type { Arrow } from "./primitives/Arrow";
import type { Cube } from "./primitives/Cube";
import type { Sphere } from "./primitives/Sphere";

export { debug as Debug };
declare const debug: Debug;
declare class Debug {
    init(): void;
    Vector3_one: Vector3;
    Vector3_zero: Vector3;
    canvas_renderer: any;
    display_texture_meshes: Mesh[];
    ctx: any;
    scene: Scene;
    camera: PerspectiveCamera;
    draw_arrow(origin: Vector3, dir: Vector3, color?: number | string): Arrow;
    draw_axis(): AxisHelper;
    set_debug_RT(RT: RenderTarget): void;
    rt_debug: RenderTarget<Texture>;
    draw_rectangle(position_2d: Vector2 | Vector3, width: number, height: number, color: number | string): void;
    clear(): void;
    draw_line_2D(from: Vector3 | Vector2, to: Vector3 | Vector2, color: number | string): void;
    draw_line(points: Vector3[], color?: number | string): Line;
    draw_cube(pos: Vector3, size: number, color: number | string): Cube;
    draw_oriented_cube(from: Vector3, to: Vector3, height?: number, color?: number | string, depth?: number): Cube;
    draw_plane(width?: number, height?: number, color?: number | string): Mesh;
    draw_empty_cube(pos: Vector3, size: number, color: number | string): Box3Helper;
    draw_sphere(pos: Vector3, size: number, color: number | string): Sphere;
    draw_point_array(input_points: Vector3[], open?: boolean, color?: number | string): Line;
    draw_sphere_helper(sphere: Sphere, color: number | string): Mesh;
    draw_math_sphere(sphere: Sphere): void;
    draw_bounding_box(bb: Box3): void;
    draw_curve(curve: Vector3[], options: {
        offset: number;
    }): void;
    draw_texture(tex: Texture, w: number, h: number): Mesh;
    render(graphics: typeof Graphics): void;
}
