import type { Vector3 } from "three";
declare class PlaneRaycastResolver {
    constructor();
    on_enter(intersected_point: Vector3): void;
    on_hover(intersected_point: Vector3): void;
    on_exit(): void;
}
export { PlaneRaycastResolver };
