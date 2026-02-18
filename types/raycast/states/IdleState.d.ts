import type { GroupRaycaster } from '../GroupRaycaster';
import { BaseState } from './BaseState';
declare class IdleState extends BaseState {
    constructor();
    update(context: GroupRaycaster): void;
}
export { IdleState };
