export default class ViewStateTransitionHandler {
    constructor(transition_table: any);
    last_state: ViewState;
    current_state: ViewState;
    initial_state_data: {};
    current_state_data: {};
    transition_table: any;
    transitioning: boolean;
    go_to_state(state: any, skip?: boolean): void;
    action_sequencer: any;
    update(): void;
    set_state(state: any): void;
    set_initial_state_data(initial_state_data: any): void;
}
import ViewState from "../ViewState";
