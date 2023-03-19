export class FrustumPointFitter {
    sphere: Sphere;
    fit_points(points: any, camera_quaternion: any, vertical_fov: any, aspect: any): any;
    apply_center_correction_to_pos(target_pos: any, points: any, camera_quaternion: any, up_plane: any, down_plane: any, left_plane: any, right_plane: any): void;
    get_vertical_correction(points: any, down_plane: any, up_plane: any, camera_quaternion: any): any;
    get_hozirontal_correction(points: any, left_plane: any, right_plane: any, camera_quaternion: any): any;
    get_up_plane_normal(camera_quaternion: any, v_fov: any): any;
    get_down_plane_normal(camera_quaternion: any, v_fov: any): any;
    get_left_plane_normal(camera_quaternion: any, h_fov: any): any;
    get_right_plane_normal(camera_quaternion: any, h_fov: any): any;
    get_distance_to_fit_rect(width: any, height: any, vertical_fov: any, aspect: any): number;
}

import { Sphere } from "three";
