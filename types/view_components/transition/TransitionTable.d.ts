declare class TransitionTable {
    default_state_data: object;
    transitions: any[];
    constructor();
    get(from_state_name: any, to_state_name: any, current_context: any): import("../..").ActionSequencer;
    add_transitions(transitions: any): void;
    set_transitions(transitions: any): void;
    set_default_state_data(default_state_data: any): void;
}
export { TransitionTable };
