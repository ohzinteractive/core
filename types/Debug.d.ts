import { PerspectiveCamera } from "ohzi-core";
import { AxisHelper } from "ohzi-core/types/components/AxisHelper";
import { Arrow } from "ohzi-core/types/primitives/Arrow";
import { Cube } from "ohzi-core/types/primitives/Cube";
import { Sphere } from "ohzi-core/types/primitives/Sphere";

export class Debug {
    static init(): void;
    static Vector3_one: any;
    static Vector3_zero: any;
    static canvas_renderer: any;
    static display_texture_meshes: any[];
    static ctx: any;
    static scene: any;
    static camera: PerspectiveCamera;
    static draw_arrow(origin: any, dir: any, color?: number): Arrow
    ;
    static draw_axis(): AxisHelper;
    static set_debug_RT(RT: any): void;
    static rt_debug: any;
    static draw_rectangle(position_2d: any, width: any, height: any, color: any): void;
    static clear(): void;
    static draw_line_2D(from: any, to: any, color: any): void;
    static draw_line(points: any, color?: number): any;
    static draw_cube(pos: any, size: any, color: any): Cube;
    static draw_oriented_cube(from: any, to: any, height?: number, color?: string, depth?: number): Cube;
    static draw_plane(width: any, height: any, color: any): any;
    static draw_empty_cube(pos: any, size: any, color: any): any;
    static draw_sphere(pos: any, size: any, color: any): Sphere;
    static draw_point_array(input_points: any, open?: boolean, color?: number): any;
    static draw_sphere_helper(sphere: any, color: any): any;
    static draw_math_sphere(sphere: any): void;
    static draw_bounding_box(bb: any): void;
    static draw_curve(curve: any, options: any): void;
    static draw_texture(tex: any, w: any, h: any): any;
    static render(graphics: any): void;
}
