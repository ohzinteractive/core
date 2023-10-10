export class TransitionTable {
    transitions: any[];
    default_state_data: {};
    transitions_velocity: number;
    get(from_state_name: any, to_state_name: any, current_context: any): import("../../action_sequencer/ActionSequencer").ActionSequencer;
    add_transitions(transitions: any): void;
    set_transitions(transitions: any): void;
    set_default_state_data(default_state_data: any): void;
    set_transitions_velocity(transitions_velocity: any): void;
}
