export class PlaneRaycaster {
    constructor(raycast_resolver: any);
    raycast_resolver: any;
    raycaster: Raycaster;
    current_intersected_point: Vector3;
    update(reference_position: any, plane_normal: any): void;
}
import { Raycaster } from "three/src/core/Raycaster";
import { Vector3 } from "three/src/math/Vector3";
