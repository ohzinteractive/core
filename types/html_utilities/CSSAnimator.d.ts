import { EasingFunctions } from '../utilities/EasingFunctions';
import { Animating } from './css_animator_states/Animating';
import { Idle } from './css_animator_states/Idle';
declare class CSSAnimator {
    css_property: string;
    current_state: Idle;
    duration: number;
    easing_function: typeof EasingFunctions.ease_in_out_cubic;
    element: HTMLElement;
    finished_callback: () => void;
    from: number;
    to: number;
    value_prefix: string;
    value_suffix: string;
    constructor({ element, css_property, from, to, duration, value_prefix, value_suffix, easing_function, finished_callback }: {
        element: HTMLElement;
        css_property: string;
        from?: number;
        to?: number;
        duration?: number;
        value_prefix?: string;
        value_suffix?: string;
        easing_function?: typeof EasingFunctions.ease_in_out_cubic;
        finished_callback?: () => void;
    });
    animate(): void;
    stop(): void;
    set_property_value(value: number): void;
    update(): void;
    get is_animating(): boolean;
    set_current_state(state: Idle | Animating): void;
}
export { CSSAnimator };
