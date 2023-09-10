export class ViewStateTransitionHandler {
    constructor(transition_table: any);
    last_state: ViewState;
    current_state: ViewState;
    default_state_data: {};
    current_state_data: {};
    transition_table: any;
    transitioning: boolean;
    go_to_state(state: any, skip?: boolean): void;
    action_sequencer: any;
    update(): void;
    before_update(): void;
    fixed_update(): void;
    set_state(state: any): void;
    set_default_state_data(default_state_data: any): void;
    __update_transitions(): void;
    __exit_last_state(): void;
}
import { ViewState } from "../ViewState";
