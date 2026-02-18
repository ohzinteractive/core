import type { GroupRaycaster } from '../GroupRaycaster';
import { BaseState } from './BaseState';
declare class OnRaycastHover extends BaseState {
    constructor();
    on_enter(context: GroupRaycaster): void;
    update(context: GroupRaycaster): void;
}
export { OnRaycastHover };
