import { Vector2 } from 'three';
import type { Input } from '../../../lib/Input';
import type { CameraController } from '../../CameraController';
import { AbstractCameraState } from './AbstractCameraState';
export declare class CommonCameraState extends AbstractCameraState {
    azimuth_dir: number;
    forward_dir: number;
    last_point: Vector2;
    right_dir: number;
    rotation_velocity: Vector2;
    shift_key: boolean;
    y_dir: number;
    input: Input;
    constructor(input: Input);
    on_enter(camera_controller: CameraController): void;
    on_exit(camera_controller: CameraController): void;
    update(camera_controller: CameraController): void;
    __show_camera_position(camera_controller: CameraController): void;
    __zoom_camera(camera_controller: CameraController): void;
    __rotate_camera(camera_controller: CameraController): void;
    __move_camera(camera_controller: CameraController): void;
    __check_key_down(): void;
    __check_key_up(): void;
}
