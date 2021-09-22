export class ObjectManipulator {
    target_obj: any;
    up_handle: ManipulatorHandle;
    right_handle: ManipulatorHandle;
    forward_handle: ManipulatorHandle;
    active_handle: ManipulatorHandle;
    tmp_displacement_vector: any;
    tmp_local_pos: any;
    tmp_up_v2: any;
    tmp_right_v2: any;
    use_vertical_translation: boolean;
    translation_sign: boolean;
    visible: boolean;
    update(): void;
    set_translation_axis(active_handle: any): void;
    check_active_handle(): void;
    set_target(obj: any): void;
}
import { ManipulatorHandle } from "../editor/ManipulatorHandle";
