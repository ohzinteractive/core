export class OrthographicFrustumPointFitter {
    fit_points(points: any, camera_quaternion: any, vertical_fov: any, aspect: any): {
        center: Vector3;
        distance_to_center: number;
    };
    get_distance_to_fit_rect(width: any, height: any, vertical_fov: any, aspect: any): number;
}
import { Vector3 } from "three/src/math/Vector3";
