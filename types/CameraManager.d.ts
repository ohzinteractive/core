import type { PerspectiveCamera } from "./PerspectiveCamera";

declare class CameraManager {
    init(): void;
    
    _current: PerspectiveCamera;
    _spectator: PerspectiveCamera;
    set current(arg: PerspectiveCamera);
    get current(): PerspectiveCamera;
    set spectator(arg: PerspectiveCamera);
    get spectator(): PerspectiveCamera;
}

declare const camera_manager: CameraManager;
export { camera_manager as CameraManager };

