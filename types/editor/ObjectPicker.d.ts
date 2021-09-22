export class ObjectPicker {
    constructor(renderer: any, scene: any, camera: any);
    renderer: any;
    readback_buffer: Uint8Array;
    scene: any;
    camera: any;
    camera_layers: any;
    clear_color: any;
    picking_texture: any;
    tmp_scene_auto_update: any;
    tmp_mouse_pos: any;
    pick(mouse_NDC: any, objects: any): number;
    __prepare_scene(objects: any): void;
    __restore_scene(objects: any): void;
    __readback_id(mouse_NDC: any): number;
}
