export class CSSAnimator {
    constructor({ element, css_property, from, to, duration, value_prefix, value_suffix, easing_function, finished_callback }: {
        element: any;
        css_property: any;
        from?: number;
        to?: number;
        duration?: number;
        value_prefix?: string;
        value_suffix?: string;
        easing_function?: typeof EasingFunctions.ease_in_out_cubic;
        finished_callback?: () => void;
    });
    element: any;
    css_property: any;
    from: number;
    to: number;
    value_prefix: string;
    value_suffix: string;
    duration: number;
    easing_function: typeof EasingFunctions.ease_in_out_cubic;
    finished_callback: () => void;
    current_state: Idle;
    animate(): void;
    stop(): void;
    set_property_value(value: any): void;
    update(): void;
    get is_animating(): boolean;
    set_current_state(state: any): void;
}
import { EasingFunctions } from "../utilities/EasingFunctions";
import { Idle } from "./css_animator_states/Idle";
