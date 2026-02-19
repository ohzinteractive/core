export declare class AbstractCameraState {
    constructor();
    on_enter(camera_controller: any): void;
    on_exit(camera_controller: any): void;
    update(camera_controller: any): void;
    lock_zoom(): void;
    unlock_zoom(): void;
}
