export class ActionSequencerBuilder {
    constructor(default_state_data: any);
    default_state_data: any;
    from_animation_sheet(animation_data: any, current_context: any, initial_context: any, transitions_velocity: any): ActionSequencer;
    state_to_tracks(state: any, longest_time: any): {
        attribute_name: string;
        from_time: number;
        to_time: any;
        to_value: any;
        initial: boolean;
        easing_function: string;
    }[];
    from_draw_io(xml: any, context: any): ActionSequencer;
    get_longest_time(tracks: any): number;
}
import { ActionSequencer } from "../../action_sequencer/ActionSequencer";
