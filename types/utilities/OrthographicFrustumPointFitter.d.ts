export default class OrthographicFrustumPointFitter {
    fit_points(points: any, camera_quaternion: any, vertical_fov: any, aspect: any): {
        center: any;
        distance_to_center: number;
    };
    get_distance_to_fit_rect(width: any, height: any, vertical_fov: any, aspect: any): number;
}
