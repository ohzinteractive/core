import type { Vector3 } from 'three';
import type { Input } from '../lib/Input';
import { PlaneRaycaster } from './PlaneRaycaster';
import { PlaneRaycastResolver } from './PlaneRaycastResolver';
declare class PlaneDragResolver extends PlaneRaycastResolver {
    _drag_started: boolean;
    _plane_raycaster: PlaneRaycaster;
    input: Input;
    constructor(input: Input);
    on_drag_start(contact_point: any): void;
    on_drag_move(contact_point: any): void;
    on_drag_end(): void;
    on_update(): void;
    on_drag_button_pressed(): boolean;
    on_drag_button_released(): boolean;
    on_hover(intersection_point: Vector3): void;
    get drag_started(): boolean;
    on_exit(): void;
    update(reference_position: any, plane_normal: any): void;
}
export { PlaneDragResolver };
