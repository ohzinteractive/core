import { Plane, Quaternion, Sphere, Vector3 } from 'three';
declare class FrustumPointFitter {
    sphere: Sphere;
    constructor();
    fit_points(points: Vector3[], camera_quaternion: Quaternion, vertical_fov: number, aspect: number): Vector3;
    apply_center_correction_to_pos(target_pos: Vector3, points: Vector3[], camera_quaternion: Quaternion, up_plane: Plane, down_plane: Plane, left_plane: Plane, right_plane: Plane): void;
    get_vertical_correction(points: Vector3[], down_plane: Plane, up_plane: Plane, camera_quaternion: Quaternion): Vector3;
    get_hozirontal_correction(points: Vector3[], left_plane: Plane, right_plane: Plane, camera_quaternion: Quaternion): Vector3;
    get_up_plane_normal(camera_quaternion: Quaternion, v_fov: number): Vector3;
    get_down_plane_normal(camera_quaternion: Quaternion, v_fov: number): Vector3;
    get_left_plane_normal(camera_quaternion: Quaternion, h_fov: number): Vector3;
    get_right_plane_normal(camera_quaternion: Quaternion, h_fov: number): Vector3;
    get_distance_to_fit_rect(width: number, height: number, vertical_fov: number, aspect: number): number;
}
export { FrustumPointFitter };
