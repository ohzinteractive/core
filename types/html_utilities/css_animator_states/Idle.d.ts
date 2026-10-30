declare class Idle {
    constructor();
    get is_animating(): boolean;
    on_enter(view: any): void;
    update(view: any): void;
    on_exit(view: any): void;
}
export { Idle };
