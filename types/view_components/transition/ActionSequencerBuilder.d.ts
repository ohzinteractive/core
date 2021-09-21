export default class ActionSequencerBuilder {
    constructor(initial_state_data: any);
    initial_state_data: any;
    from_animation_sheet(animation_data: any, current_context: any, initial_context: any): ActionSequencer;
    state_to_tracks(state: any): {
        attribute_name: string;
        from_time: number;
        to_time: number;
        to_value: any;
        easing_function: string;
    }[];
    from_draw_io(xml: any, context: any): ActionSequencer;
}
import ActionSequencer from "../../action_sequencer/ActionSequencer";
