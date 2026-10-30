import type { ActionEvent } from './ActionEvent';
import type { ActionInterpolator } from './ActionInterpolator';
declare class ActionSequencer {
    action_events: {
        action: ActionEvent;
        trigger_time: number;
    }[];
    channels: {
        [key: string]: any[];
    };
    context: any;
    duration: number;
    elapsed_time: number;
    initial_context: any;
    playback_speed: number;
    playing: boolean;
    previous_elapsed_time: number;
    tmp_t: number;
    constructor(context?: {});
    play(): void;
    stop(): void;
    reset(): void;
    skip(): void;
    update(delta_time: number): void;
    set_progress(time: number): void;
    set_normalized_progress(t: number): void;
    get_progress(): number;
    is_finished(): boolean;
    add_action_event(trigger_time: number, action: ActionEvent): void;
    add_action_interpolator(from: number, to: number, interpolator: ActionInterpolator, use_dynamic_from_value?: boolean): void;
    get_current_target_value(name: string): number;
    get_current_starting_value(name: string): number;
    get_current_progress(name: string): number;
    get_duration(): number;
    __play_clips(from: number, to: number): void;
    __play_events(from: number, to: number): void;
    evaluate_keyframe(keyframe: any, time: number): any;
    get_keyframes(channel_name: string): any[];
    is_channel_redefined(channel_name: string): boolean;
    __linear_map_01(value: number, from_range_start_value: number, from_range_end_value: number): number;
    __get_current_keyframe(channel_name: string, time: number): any;
    __get_playback_speed(): number;
    set_initial_value_on_channel(name: string, value: number): void;
    set_final_value_on_channel(name: string, value: number): void;
}
export { ActionSequencer };
