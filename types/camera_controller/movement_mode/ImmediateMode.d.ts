import type { CameraController } from '../CameraController';
import { CameraMovementMode } from './CameraMovementMode';
import { Quaternion, Vector2, Vector3 } from 'three';
export declare class ImmediateMode extends CameraMovementMode {
    rotation_speed: Vector2;
    tmp_camera_target_pos: Vector3;
    tmp_forward: Vector3;
    tmp_quat: Quaternion;
    vector_forward_axis: Vector3;
    constructor();
    on_enter(camera_controller: CameraController): void;
    update(camera_controller: CameraController): void;
    get_target_camera_pos(camera_controller: CameraController): Vector3;
}
