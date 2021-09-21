export default class ActionSequencer {
    constructor(context: any);
    elapsed_time: number;
    playing: boolean;
    action_events: any[];
    context: any;
    initial_context: any;
    tmp_t: number;
    channels: {};
    duration: number;
    play(): void;
    stop(): void;
    reset(): void;
    skip(): void;
    update(delta_time: any): void;
    set_progress(time: any): void;
    set_normalized_progress(t: any): void;
    get_progress(): any;
    is_finished(): boolean;
    add_action_event(trigger_time: any, action: any): void;
    add_action_interpolator(from: any, to: any, interpolator: any, use_dynamic_from_value?: boolean): void;
    get_property_target_value(name: any): any;
    get_duration(): number;
    __play_clips(from: any, to: any): void;
    evaluate_keyframe(keyframe: any, time: any): any;
    __linear_map_01(value: any, from_range_start_value: any, from_range_end_value: any): number;
    __get_nearest_keyframe(channel_name: any, time: any): any;
}
