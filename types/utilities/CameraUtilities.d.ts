export { camera_utilities as CameraUtilities };
declare const camera_utilities: CameraUtilities;
declare class CameraUtilities {
    init(input: any): void;
    tmp_mat: Matrix4;
    plane: Plane;
    ray: Ray;
    tmp_size: Vector3;
    tmp_unproj: Vector3;
    input: any;
    get_up_dir(camera: any): Vector3;
    get_forward_dir(camera: any): Vector3;
    get_right_dir(camera: any): Vector3;
    unproject_mouse_position(NDC: any, camera: any): Vector3;
    get_plane_intersection(plane_position: any, plane_normal: any, NDC: any, camera: any): Vector3;
    fit_points_on_camera(points: any, zoom_scale?: number): {
        position: Vector3;
        zoom: number;
    };
    get_zoom_to_fit_rect(width: any, height: any): number;
    get_zoom_to_fit_box(bb: any, camera: any): number;
    get_html_screen_pos(object: any, camera: any): Vector3;
    world_pos_to_screen(pos: any, camera: any): Vector3;
    update_projection(camera: any): void;
    fit_bounding_box_points(camera: any, bb: any, scale?: number): {
        zoom: number;
        reference_position: Vector3;
        camera_position: Vector3;
    };
    fit_points(camera: any, points: any, zoom_scale?: number): {
        zoom: number;
        reference_position: Vector3;
        camera_position: Vector3;
    };
    reference_zoom: number;
}
import { Matrix4 } from "three/src/math/Matrix4";
import { Plane } from "three/src/math/Plane";
import { Ray } from "three/src/math/Ray";
import { Vector3 } from "three/src/math/Vector3";
