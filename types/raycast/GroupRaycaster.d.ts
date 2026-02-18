import { Intersection, Raycaster } from "three";
import { IdleState } from "./states/IdleState";

export class GroupRaycaster {
    constructor(raycastee_group: any, raycast_resolver: any, camera: any, input: any);
    camera: any;
    raycast_resolver: any;
    raycastee_group: any;
    input: any;
    raycaster: Raycaster;
    current_state: IdleState;
    current_intersections: Intersection[];
    set_raycastee_group(raycastee_group: any): void;
    update(): void;
    set_state(new_state: any): void;
}
