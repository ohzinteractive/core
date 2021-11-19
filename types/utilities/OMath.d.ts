export class OMath {
    static linear_map(value: any, from_range_start_value: any, from_range_end_value: any, to_range_start_value: any, to_range_end_value: any): any;
    static between(value: any, min: any, max: any): boolean;
    static mod(number: any, divisor: any): number;
    static rgb_to_hex(rgb: any): string;
    static project_points_on_plane(points: any, plane: any): any[];
    static matrix4_lerp(from: any, to: any, target: any, t: any): void;
    static equals(x1: any, x2: any): boolean;
    static lerp(x: number, y: number, t: number): number;
    static clamp(value: number, min: number, max: number): number;
    static euclideanModulo(n: number, m: number): number;
    static pingpong(x: number, length: number): number;
    static degToRad(degrees: number): number;
    static deg_to_rad(degrees: number): number;
    static radToDeg(radians: number): number;
    static rad_to_deg(radians: number): number;
    static perspective_divide(v: any): any;
    static points_average(points: any): any;
    static get_random_color(): string;
    static saturate(x: number): number;
}
