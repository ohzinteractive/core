export class ActionSequencer {
    /**
     * @param {any} [context]
     */
    constructor(context?: any);
    previous_elapsed_time: number;
    elapsed_time: number;
    playback_speed: number;
    playing: boolean;
    /** @type {{action:ActionEvent, trigger_time:number }[]} */
    action_events: {
        action: ActionEvent;
        trigger_time: number;
    }[];
    context: any;
    initial_context: any;
    tmp_t: number;
    /** @type {{[key:string]:any[]}} */
    channels: {
        [key: string]: any[];
    };
    duration: number;
    play(): void;
    stop(): void;
    reset(): void;
    skip(): void;
    /**
     * @param {number} delta_time
     */
    update(delta_time: number): void;
    /**
     * @param {number} time
     */
    set_progress(time: number): void;
    /**
     * @param {number} t
     */
    set_normalized_progress(t: number): void;
    get_progress(): number;
    is_finished(): boolean;
    /**
     * @param {number} trigger_time
     * @param {ActionEvent} action
     */
    add_action_event(trigger_time: number, action: ActionEvent): void;
    /**
     * @param {number} from
     * @param {number} to
     * @param {ActionInterpolator} interpolator
     * @param {boolean} [use_dynamic_from_value]
     */
    add_action_interpolator(from: number, to: number, interpolator: ActionInterpolator, use_dynamic_from_value?: boolean): void;
    /**
     * @param {string} name
     */
    get_current_target_value(name: string): any;
    /**
     * @param {string} name
     */
    get_current_starting_value(name: string): any;
    /**
     * @param {string} name
     */
    get_current_progress(name: string): any;
    get_duration(): number;
    /**
     * @param {number} from
     * @param {number} to
     */
    __play_clips(from: number, to: number): void;
    /**
     * @param {number} from
     * @param {number} to
     */
    __play_events(from: number, to: number): void;
    /**
     * @param {any} keyframe
     * @param {number} time
     */
    evaluate_keyframe(keyframe: any, time: number): any;
    /**
     * @param {string} channel_name
     */
    get_keyframes(channel_name: string): any[];
    /**
     * @param {string} channel_name
     */
    is_channel_redefined(channel_name: string): boolean;
    /**
     * @param {number} value
     * @param {number} from_range_start_value
     * @param {number} from_range_end_value
     * @returns {number}
     */
    __linear_map_01(value: number, from_range_start_value: number, from_range_end_value: number): number;
    /**
     * @param {string} channel_name
     * @param {number} time
     */
    __get_current_keyframe(channel_name: string, time: number): any;
    __get_playback_speed(): number;
}
import { ActionEvent } from "./ActionEvent";
import { ActionInterpolator } from "./ActionInterpolator";
