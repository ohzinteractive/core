import type { PerspectiveCamera } from './PerspectiveCamera';
declare class CameraManager {
    _current: PerspectiveCamera;
    _spectator: PerspectiveCamera;
    init(): void;
    set current(camera: PerspectiveCamera);
    get current(): PerspectiveCamera;
    set spectator(camera: PerspectiveCamera);
    get spectator(): PerspectiveCamera;
}
declare const camera_manager: CameraManager;
export { camera_manager as CameraManager };
