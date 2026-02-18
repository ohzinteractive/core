import type { ActionSequencer } from "../../index";

export class TransitionTable {
    transitions: any[];
    default_state_data: {};
    
    get(from_state_name: any, to_state_name: any, current_context: any): ActionSequencer;
    add_transitions(transitions: any): void;
    set_transitions(transitions: any): void;
    set_default_state_data(default_state_data: any): void;
}
