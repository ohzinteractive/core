export { camera_utilities as CameraUtilities };
declare const camera_utilities: CameraUtilities;
declare class CameraUtilities {
    init(input: any): void;
    tmp_mat: any;
    plane: any;
    ray: any;
    tmp_size: any;
    tmp_unproj: any;
    input: any;
    get_up_dir(camera: any): any;
    get_forward_dir(camera: any): any;
    get_right_dir(camera: any): any;
    unproject_mouse_position(NDC: any, camera: any): any;
    get_plane_intersection(plane_position: any, plane_normal: any, NDC: any, camera: any): any;
    fit_points_on_camera(points: any, zoom_scale?: number): {
        position: any;
        zoom: number;
    };
    get_zoom_to_fit_rect(width: any, height: any): number;
    get_zoom_to_fit_box(bb: any, camera: any): number;
    get_html_screen_pos(object: any, camera: any): any;
    world_pos_to_screen(pos: any, camera: any): any;
    update_projection(camera: any): void;
    fit_bounding_box_points(camera: any, bb: any, scale?: number): {
        zoom: any;
        reference_position: any;
        camera_position: any;
    };
    fit_points(camera: any, points: any, zoom_scale?: number): {
        zoom: any;
        reference_position: any;
        camera_position: any;
    };
    reference_zoom: number;
}
