export { camera_manager as CameraManager };
declare const camera_manager: CameraManager;
declare class CameraManager {
    init(): void;
    _current: PerspectiveCamera;
    _spectator: PerspectiveCamera;
    set current(arg: PerspectiveCamera);
    /** @type {PerspectiveCamera} */
    get current(): PerspectiveCamera;
    set spectator(arg: PerspectiveCamera);
    /** @type {PerspectiveCamera} */
    get spectator(): PerspectiveCamera;
}
import { PerspectiveCamera } from "./PerspectiveCamera";
