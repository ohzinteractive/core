import { GroupRaycaster } from '../../raycast/GroupRaycaster';
import { RaycastResolver } from '../../raycast/RaycastResolver';
import type { Object3D } from 'three';
import type { Input } from '../../lib/Input';
declare class ObjectRotator extends RaycastResolver {
    group_raycaster: GroupRaycaster;
    input: Input;
    is_mouse_over: boolean;
    object: Object3D;
    rotation_active: boolean;
    constructor(object: Object3D, input: Input);
    on_enter(): void;
    on_exit(): void;
    is_active(): boolean;
    update(): void;
}
export { ObjectRotator };
