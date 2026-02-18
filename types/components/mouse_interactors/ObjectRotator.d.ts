import { GroupRaycaster } from "../../raycast/GroupRaycaster";
import { RaycastResolver } from "../../raycast/RaycastResolver";
export class ObjectRotator extends RaycastResolver {
    constructor(object: any, input: any);
    input: any;
    is_mouse_over: boolean;
    rotation_active: boolean;
    object: any;
    group_raycaster: GroupRaycaster;
    is_active(): boolean;
    update(): void;
}
