import type { TransitionTable } from "./transition/TransitionTable";
import type { ViewStateTransitionHandler } from "./transition/ViewStateTransitionHandler";
import type { ViewState } from "./ViewState";

export { transition_manager as TransitionManager };
declare const transition_manager: TransitionManager;
declare class TransitionManager {
    transition_table: TransitionTable;
    transition_handler: ViewStateTransitionHandler;
    get action_sequencer(): any;
    get current_state_data(): {};
    
    get_current_state(): ViewState;
    go_to_state(state: any, skip?: boolean): void;
    before_update(): void;
    update(): void;
    fixed_update(): void;
    add_transitions(transitions: any): void;
    set_transitions(transitions: any): void;
    set_state(state: any): void;
    set_default_state_data(default_state_data: any): void;
}
