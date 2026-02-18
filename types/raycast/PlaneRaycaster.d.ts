import { Raycaster, Vector3 } from "three";
export class PlaneRaycaster {
    constructor(raycast_resolver: any);
    raycast_resolver: any;
    raycaster: Raycaster;
    current_intersected_point: Vector3;
    
    update(reference_position: any, plane_normal: any): void;
}

