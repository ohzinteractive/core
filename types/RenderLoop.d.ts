import type { BaseApplication } from "./BaseApplication";
import type { Graphics } from "./Graphics";

export class RenderLoop {
    constructor(target_application: BaseApplication, graphics: typeof Graphics, input: any);
    target_application: BaseApplication;
    graphics: typeof Graphics;
    input: any;
    is_running: boolean;
    frames_passed: number;
    time_accumulator: number;
    
    update(): void;
    start(): void;
    stop(): void;
    set_state(new_state: BaseApplication): void;
    dispose(): void;
}
