import type { Camera, Object3D } from 'three';
import { Box3, Matrix4, Plane, Ray, Vector3 } from 'three';
import type { Input } from '../lib/Input';
import type { Vector2 } from '../lib/Vector2';
import type { PerspectiveCamera } from '../PerspectiveCamera';
declare class CameraUtilities {
    input: Input;
    plane: Plane;
    ray: Ray;
    tmp_mat: Matrix4;
    tmp_size: Vector3;
    tmp_unproj: Vector3;
    init(input: Input): void;
    get_up_dir(camera: Camera): Vector3;
    get_forward_dir(camera: Camera): Vector3;
    get_right_dir(camera: Camera): Vector3;
    unproject_mouse_position(NDC: Vector2, camera: PerspectiveCamera): Vector3;
    get_plane_intersection(plane_position: Vector3, plane_normal: Vector3, NDC?: Vector2, camera?: Camera): Vector3;
    fit_points_on_camera(points: Array<Vector3>, zoom_scale?: number): {
        position: Vector3;
        zoom: number;
    };
    get_zoom_to_fit_rect(width: number, height: number): number;
    get_zoom_to_fit_box(bb: Box3, camera: Camera): number;
    get_html_screen_pos(object: Object3D, camera: Camera): Vector3;
    world_pos_to_screen(pos: any, camera: any): Vector3;
    update_projection(camera: Camera): void;
    fit_bounding_box_points(camera: Camera, bb: Box3, scale?: number): {
        zoom: number;
        reference_position: Vector3;
        camera_position: Vector3;
    };
    fit_points(camera: Camera, points: Array<Vector3>, zoom_scale?: number): {
        zoom: number;
        reference_position: Vector3;
        camera_position: Vector3;
    };
}
declare const camera_utilities: CameraUtilities;
export { camera_utilities as CameraUtilities };
