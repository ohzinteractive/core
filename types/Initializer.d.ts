export { initializer as Initializer };
declare const initializer: Initializer;
declare class Initializer {
    init(input: any): void;
    /**
     * @param {RenderLoop} render_loop
     */
    dispose(render_loop: RenderLoop): void;
}
import { RenderLoop } from "./index";
