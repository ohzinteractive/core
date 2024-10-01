export class PerspectiveFrustumPointFitter {
    sphere: Sphere;
    fit_points(points: any, camera_quaternion: any, vertical_fov: any, aspect: any): Vector3;
    apply_center_correction_to_pos(target_pos: any, points: any, camera_quaternion: any, up_plane: any, down_plane: any, left_plane: any, right_plane: any): void;
    get_vertical_correction(points: any, down_plane: any, up_plane: any, camera_quaternion: any): Vector3;
    get_horizontal_correction(points: any, left_plane: any, right_plane: any, camera_quaternion: any): Vector3;
    get_up_plane_normal(camera_quaternion: any, v_fov: any): Vector3;
    get_down_plane_normal(camera_quaternion: any, v_fov: any): Vector3;
    get_left_plane_normal(camera_quaternion: any, h_fov: any): Vector3;
    get_right_plane_normal(camera_quaternion: any, h_fov: any): Vector3;
    get_distance_to_fit_rect(width: any, height: any, vertical_fov: any, aspect: any): number;
}
import { Sphere } from "three/src/math/Sphere";
import { Vector3 } from "three/src/math/Vector3";
