import { TransitionTable } from './transition/TransitionTable';
import { ViewStateTransitionHandler } from './transition/ViewStateTransitionHandler';
import type { ViewState } from './ViewState';
declare class TransitionManager {
    transition_handler: ViewStateTransitionHandler;
    transition_table: TransitionTable;
    constructor();
    get action_sequencer(): import("..").ActionSequencer;
    get current_state_data(): {
        [key: string]: any;
    };
    get_current_state(): ViewState;
    go_to_state(state: ViewState, skip?: boolean): void;
    before_update(): void;
    update(): void;
    fixed_update(): void;
    add_transitions(transitions: any): void;
    set_transitions(transitions: any): void;
    set_state(state: ViewState): void;
    set_default_state_data(default_state_data: object): void;
}
declare const transition_manager: TransitionManager;
export { transition_manager as TransitionManager };
