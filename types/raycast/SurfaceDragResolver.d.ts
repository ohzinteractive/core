export class SurfaceDragResolver extends RaycastResolver {
    constructor(surface_mesh: any, input: any);
    _drag_started: boolean;
    _group_raycaster: GroupRaycaster;
    input: any;
    on_drag_start(contact_point: any): void;
    on_drag_move(contact_point: any): void;
    on_drag_end(): void;
    _on_update(): void;
    get drag_started(): boolean;
    on_hover(intersected_object: any, intersection_data: any): void;
    update(): void;
}
import { RaycastResolver } from "./RaycastResolver";
import { GroupRaycaster } from "./GroupRaycaster";
