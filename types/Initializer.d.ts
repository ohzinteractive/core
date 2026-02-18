import type { RenderLoop } from "./index";

export { initializer as Initializer };
declare const initializer: Initializer;
declare class Initializer {
    init(input: any): void;
    dispose(render_loop: RenderLoop): void;
}
