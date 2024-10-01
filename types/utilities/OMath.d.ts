export class OMath {
    static linear_map(value: any, from_range_start_value: any, from_range_end_value: any, to_range_start_value: any, to_range_end_value: any): any;
    static between(value: any, min: any, max: any): boolean;
    static mod(number: any, divisor: any): number;
    static rgb_to_hex(rgb: any): string;
    static project_points_on_plane(points: any, plane: any): any[];
    static matrix4_lerp(from: any, to: any, target: any, t: any): void;
    static equals(x1: any, x2: any): boolean;
    static lerp(x: any, y: any, t: any): number;
    static clamp(value: any, min: any, max: any): number;
    static euclideanModulo(n: any, m: any): number;
    static pingpong(x: any, length?: number): number;
    static degToRad(degrees: any): number;
    static radToDeg(radians: any): number;
    static deg_to_rad(degrees: any): number;
    static rad_to_deg(radians: any): number;
    static perspective_divide(v: any): any;
    static points_average(points: any): any;
    static get_random_color(): string;
    static saturate(x: any): number;
}
