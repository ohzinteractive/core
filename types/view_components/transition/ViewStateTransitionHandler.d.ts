import type { ActionSequencer } from '../../action_sequencer/ActionSequencer';
import { ViewState } from '../ViewState';
import type { TransitionTable } from './TransitionTable';
declare class ViewStateTransitionHandler {
    action_sequencer: ActionSequencer;
    current_state: ViewState;
    current_state_data: {
        [key: string]: any;
    };
    default_state_data: {
        [key: string]: any;
    };
    last_state: ViewState;
    transition_table: TransitionTable;
    transitioning: boolean;
    constructor(transition_table: TransitionTable);
    go_to_state(state: ViewState, skip?: boolean): void;
    update(): void;
    before_update(): void;
    fixed_update(): void;
    set_state(state: ViewState): void;
    set_default_state_data(default_state_data: object): void;
    __update_transitions(): void;
    __exit_last_state(): void;
}
export { ViewStateTransitionHandler };
