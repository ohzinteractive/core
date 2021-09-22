 export class CameraUtilities {
    static init(): void;
    static tmp_mat: any;
    static tmp_vec: any;
    static tmp_vec2: any;
    static plane: any;
    static ray: any;
    static tmp_size: any;
    static tmp_unproj: any;
    static get_up_dir(camera: any): any;
    static get_forward_dir(camera: any): any;
    static get_right_dir(camera: any): any;
    static unproject_mouse_position(NDC: any, camera: any): any;
    static get_plane_intersection(plane_position: any, plane_normal: any, NDC: any, camera: any): any;
    static fit_points_on_camera(points: any, zoom_scale?: number): {
        position: any;
        zoom: number;
    };
    static get_zoom_to_fit_rect(width: any, height: any): number;
    static get_zoom_to_fit_box(bb: any, camera: any): number;
    static get_html_screen_pos(object: any, camera: any): any;
    static world_pos_to_screen(pos: any, camera: any): any;
    static update_projection(camera: any): void;
}
