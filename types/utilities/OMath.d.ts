import type { Matrix4, Plane, Vector3 } from "three";
declare class OMath {
    constructor();
    static linear_map(value: number, from_range_start_value: number, from_range_end_value: number, to_range_start_value: number, to_range_end_value: number): number;
    static between(value: number, min: number, max: number): boolean;
    static mod(number: number, divisor: number): number;
    static rgb_to_hex(rgb: {
        r: string;
        g: string;
        b: string;
    }): string;
    static project_points_on_plane(points: Vector3[], plane: Plane): Vector3[];
    static matrix4_lerp(from: Matrix4, to: Matrix4, target: Matrix4, t: number): void;
    static equals(x1: number, x2: number): boolean;
    static lerp(x: number, y: number, t: number): number;
    static clamp(value: number, min: number, max: number): number;
    static euclideanModulo(n: number, m: number): number;
    static pingpong(x: number, length?: number): number;
    static degToRad(degrees: number): number;
    static radToDeg(radians: number): number;
    static deg_to_rad(degrees: number): number;
    static rad_to_deg(radians: number): number;
    static perspective_divide(v: {
        x: number;
        y: number;
        z: number;
        w: number;
    }): {
        x: number;
        y: number;
        z: number;
        w: number;
    };
    static points_average(points: Vector3[]): Vector3;
    static get_random_color(): string;
    static saturate(x: number): number;
    static generate_uuid(): string;
}
export { OMath };
