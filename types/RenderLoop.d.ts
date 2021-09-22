export class RenderLoop {
    constructor(target_application: any, graphics: any);
    _frame_id: number;
    target_application: any;
    graphics: any;
    is_running: boolean;
    frames_passed: number;
    update(): void;
    start(): void;
    stop(): void;
    set_state(new_state: any): void;
    dispose(): void;
}
