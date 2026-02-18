import type { Input } from '../components/Input';
import { RaycastResolver } from './RaycastResolver';
import { IdleState } from './states/IdleState';
import type { Camera, Intersection, Object3D } from 'three';
import { Raycaster } from 'three';
import type { BaseState } from './states/BaseState';
declare class GroupRaycaster {
    camera: Camera;
    current_intersections: Intersection[];
    current_state: IdleState;
    input: Input;
    raycast_resolver: RaycastResolver;
    raycastee_group: Object3D[];
    raycaster: Raycaster;
    constructor(raycastee_group: Object3D[], raycast_resolver: RaycastResolver, camera: Camera, input: Input);
    set_raycastee_group(raycastee_group: Object3D[]): void;
    update(): void;
    set_state(new_state: BaseState): void;
}
export { GroupRaycaster };
