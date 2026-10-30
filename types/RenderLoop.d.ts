import { BaseApplication } from './BaseApplication';
import type { Graphics } from './Graphics';
import type { Input } from './lib/Input';
declare class RenderLoop {
    frames_passed: number;
    graphics: typeof Graphics;
    input: Input;
    is_running: boolean;
    target_application: BaseApplication;
    time_accumulator: number;
    constructor(target_application: BaseApplication, graphics: typeof Graphics, input: Input);
    update(elapsed_time: number): void;
    start(): void;
    stop(): void;
    set_state(new_state: BaseApplication): void;
    dispose(): void;
}
export { RenderLoop };
