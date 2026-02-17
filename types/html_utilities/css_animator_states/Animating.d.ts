declare class Animating {
    easing_function_t: number;
    t: number;
    constructor();
    get is_animating(): boolean;
    on_enter(animator: any): void;
    update(animator: any): void;
    on_exit(view: any): void;
}
export { Animating };
