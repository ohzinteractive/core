export class BaseApplication {
    on_post_start(): void;
    /**
      * @param {RenderLoop} [loop]
     */
    on_enter(loop?: RenderLoop): void;
    /**
      * @param {RenderLoop} [loop]
     */
    on_exit(loop?: RenderLoop): void;
    before_update(): void;
    update(): void;
    fixed_update(): void;
    on_post_render(): void;
    on_pre_render(): void;
    on_frame_end(): void;
}
import { RenderLoop } from "./RenderLoop";
