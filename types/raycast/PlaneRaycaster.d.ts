import { Raycaster, Vector3 } from 'three';
import type { RaycastResolver } from './RaycastResolver';
declare class PlaneRaycaster {
    current_intersected_point: Vector3;
    raycast_resolver: RaycastResolver;
    raycaster: Raycaster;
    constructor(raycast_resolver: RaycastResolver);
    update(reference_position: any, plane_normal: any): void;
}
export { PlaneRaycaster };
