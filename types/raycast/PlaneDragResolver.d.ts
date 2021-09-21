export default class PlaneDragResolver extends PlaneRaycastResolver {
    _drag_started: boolean;
    _plane_raycaster: PlaneRaycaster;
    on_drag_start(contact_point: any): void;
    on_drag_move(contact_point: any): void;
    on_drag_end(): void;
    on_update(): void;
    on_drag_button_pressed(): any;
    on_drag_button_released(): any;
    get drag_started(): boolean;
    update(reference_position: any, plane_normal: any): void;
}
import PlaneRaycastResolver from "./PlaneRaycastResolver";
import PlaneRaycaster from "./PlaneRaycaster";
