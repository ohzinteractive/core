import type { RenderLoop } from './index';
import type { Input } from './lib/Input';
declare class Initializer {
    constructor();
    init(input: Input): void;
    dispose(render_loop: RenderLoop): void;
}
declare const initializer: Initializer;
export { initializer as Initializer };
