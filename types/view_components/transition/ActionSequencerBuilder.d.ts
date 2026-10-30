import { ActionSequencer } from '../../action_sequencer/ActionSequencer';
declare class ActionSequencerBuilder {
    default_state_data: object;
    constructor(default_state_data: object);
    from_animation_sheet(animation_data: any, current_context: any, initial_context?: any): ActionSequencer;
    state_to_tracks(state: any, longest_time: number): {
        attribute_name: string;
        from_time: number;
        to_time: number;
        to_value: any;
        initial: boolean;
        easing_function: string;
    }[];
    from_draw_io(xml: any, context: any): ActionSequencer;
    get_longest_time(tracks: any): number;
}
export { ActionSequencerBuilder };
