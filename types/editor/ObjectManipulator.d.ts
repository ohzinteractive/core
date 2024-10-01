export class ObjectManipulator extends Object3D<import("three").Object3DEventMap> {
    constructor(input: any);
    input: any;
    target_obj: any;
    up_handle: ManipulatorHandle;
    right_handle: ManipulatorHandle;
    forward_handle: ManipulatorHandle;
    active_handle: ManipulatorHandle;
    tmp_displacement_vector: Vector3;
    tmp_local_pos: Vector3;
    tmp_up_v2: Vector2;
    tmp_right_v2: Vector2;
    use_vertical_translation: boolean;
    translation_sign: boolean;
    update(): void;
    set_translation_axis(active_handle: any): void;
    check_active_handle(): void;
    set_target(obj: any): void;
}
import { Object3D } from "three/src/core/Object3D";
import { ManipulatorHandle } from "../editor/ManipulatorHandle";
import { Vector3 } from "three/src/math/Vector3";
import { Vector2 } from "three/src/math/Vector2";
