export class ViewState {
    constructor(name: any);
    name: any;
    start(): void;
    before_enter(): void;
    on_enter(): void;
    before_exit(): void;
    on_exit(): void;
    before_update(): void;
    update(): void;
    fixed_update(): void;
    update_enter_transition(global_view_data: any, transition_progress: any, action_sequencer: any): void;
    update_exit_transition(global_view_data: any, transition_progress: any, action_sequencer: any): void;
}
