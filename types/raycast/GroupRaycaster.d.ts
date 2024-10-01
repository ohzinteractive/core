export class GroupRaycaster {
    constructor(raycastee_group: any, raycast_resolver: any, camera: any, input: any);
    camera: any;
    raycast_resolver: any;
    raycastee_group: any;
    input: any;
    raycaster: Raycaster;
    current_state: IdleState;
    current_intersections: import("three").Intersection<import("three").Object3D<import("three").Object3DEventMap>>[];
    set_raycastee_group(raycastee_group: any): void;
    update(): void;
    set_state(new_state: any): void;
}
import { Raycaster } from "three/src/core/Raycaster";
import { IdleState } from "./states/IdleState";
