export class GroupRaycaster {
    constructor(raycastee_group: any, raycast_resolver: any, camera: any);
    camera: any;
    raycast_resolver: any;
    raycastee_group: any;
    raycaster: any;
    current_state: IdleState;
    current_intersections: any;
    set_raycastee_group(raycastee_group: any): void;
    update(): void;
    set_state(new_state: any): void;
}
import { IdleState } from "./states/IdleState";
