import type { GroupRaycaster } from '../GroupRaycaster';
import { BaseState } from './BaseState';
declare class OnRaycastEnter extends BaseState {
    constructor();
    on_enter(context: GroupRaycaster): void;
}
export { OnRaycastEnter };
