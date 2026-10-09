import type { OrthographicCamera, Quaternion, Vector3 } from "three";
export class OrthographicFrustumPointFitter {
    fit_points(points: Vector3[], camera_quaternion: Quaternion, vertical_fov: number, aspect: number): {
        center: Vector3;
        distance_to_center: number;
    };
    get_view_bounds(points: Vector3[], camera_quaternion: Quaternion): {
        center: Vector3;
        size: Vector3;
    };
    get_zoom_to_fit_size(camera: OrthographicCamera, width: number, height: number, scale?: number): number;
    get_distance_to_fit_depth(camera: OrthographicCamera, half_depth: number, preferred_distance: number): number;
    get_distance_to_fit_rect(width: number, height: number, vertical_fov: number, aspect: number): number;
}
