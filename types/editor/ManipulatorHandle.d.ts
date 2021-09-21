export default class ManipulatorHandle {
    constructor(direction: any, color: any);
    arrow_helper: any;
    box_collider: any;
    direction: any;
    raycaster: any;
    raycast_result: any;
    tmp_p1: any;
    tmp_p2: any;
    tmp_v2: any;
    half_unit_vec: any;
    is_mouse_over(): boolean;
    get_normalized_screen_direction(): any;
}
