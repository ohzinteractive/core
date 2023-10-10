export class BaseApplication {
    on_post_start(): void;
    on_enter(): void;
    on_exit(): void;
    before_update(): void;
    update(): void;
    fixed_update(): void;
    on_post_render(): void;
    on_pre_render(): void;
    on_frame_end(): void;
    dispose(): void;
}
