export default class Animating {
    t: number;
    easing_function_t: number;
    get is_animating(): boolean;
    on_enter(animator: any): void;
    update(animator: any): void;
    on_exit(view: any): void;
}
