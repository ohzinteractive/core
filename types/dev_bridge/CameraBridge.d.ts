import type { InspectableObject } from './SceneInspector';
export interface OrbitalController {
    current_tilt: number;
    current_orientation: number;
    current_azimuth: number;
    normalized_zoom: number;
    min_zoom: number;
    max_zoom: number;
    reference_position: {
        x: number;
        y: number;
        z: number;
    };
    get_current_tilt(): number;
    get_current_orientation(): number;
    get_current_azimuth(): number;
    set_normalized_zoom(zoom: number): void;
    set_rotation(tilt?: number, orientation?: number, azimuth?: number): void;
    focus_on_bounding_box(box: unknown, scale?: number): void;
}
export interface BridgeCamera {
    position: {
        x: number;
        y: number;
        z: number;
    };
    fov?: number;
    near?: number;
    far?: number;
    clear_color?: {
        getHexString?: () => string;
    };
    clear_alpha?: number;
    updateProjectionMatrix?: () => void;
}
export interface ControllerState {
    tilt: number;
    orientation: number;
    azimuth: number;
    zoom: number;
    min_zoom: number;
    max_zoom: number;
    target: number[];
}
export interface CameraState {
    position: number[];
    fov: number | null;
    near: number | null;
    far: number | null;
    clear_color: string | null;
    clear_alpha: number | null;
    controller: ControllerState | null;
    changed?: string[];
}
export interface CameraChanges {
    tilt?: unknown;
    orientation?: unknown;
    azimuth?: unknown;
    zoom?: unknown;
    fov?: unknown;
    target?: unknown;
    position?: unknown;
}
export interface FrameRequest {
    uuid?: unknown;
    name?: unknown;
    scale?: unknown;
}
declare class CameraBridge {
    get(camera: BridgeCamera, controller: OrbitalController | null): CameraState;
    set(camera: BridgeCamera, controller: OrbitalController | null, changes: CameraChanges): CameraState;
    frame(camera: BridgeCamera, controller: OrbitalController | null, root: InspectableObject, request: FrameRequest, make_bounds: (object: InspectableObject) => unknown): CameraState;
    private apply_orbit;
    private apply_position;
    private apply_fov;
    private describe;
    private find;
    private require_camera;
    private hex;
    private number;
    private triple;
    private round;
    private error;
}
export { CameraBridge };
