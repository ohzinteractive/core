import type { Mesh, Vector3 } from 'three';
import type { Input } from '../components/Input';
import { GroupRaycaster } from './GroupRaycaster';
import { RaycastResolver } from './RaycastResolver';
declare class SurfaceDragResolver extends RaycastResolver {
    _drag_started: boolean;
    _group_raycaster: GroupRaycaster;
    input: Input;
    constructor(surface_mesh: Mesh, input: Input);
    on_drag_start(contact_point: any): void;
    on_drag_move(contact_point: any): void;
    on_drag_end(): void;
    _on_update(): void;
    get drag_started(): boolean;
    on_hover(intersected_point: Vector3): void;
    on_exit(): void;
    update(): void;
}
export { SurfaceDragResolver };
