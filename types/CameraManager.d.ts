export { camera_manager as CameraManager };
declare const camera_manager: CameraManager;
declare class CameraManager {
    init(): void;
    _current: any;
    _spectator: any;
    set current(arg: any);
    get current(): any;
    set spectator(arg: any);
    get spectator(): any;
}
