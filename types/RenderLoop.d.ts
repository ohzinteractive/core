export class RenderLoop {
    constructor(target_application: any, graphics: any, input: any);
    target_application: any;
    graphics: any;
    input: any;
    is_running: boolean;
    frames_passed: number;
    time_accumulator: number;
    update(): void;
    start(): void;
    stop(): void;
    set_state(new_state: any): void;
    dispose(): void;
}
