export class ObjectPicker {
    constructor(renderer: any, scene: any, camera: any);
    renderer: any;
    readback_buffer: Uint8Array;
    scene: any;
    camera: any;
    camera_layers: any;
    clear_color: Color;
    picking_texture: WebGLRenderTarget<import("three").Texture>;
    tmp_scene_auto_update: any;
    tmp_mouse_pos: Vector2;
    pick(mouse_NDC: any, objects: any): number;
    __prepare_scene(objects: any): void;
    __restore_scene(objects: any): void;
    __readback_id(mouse_NDC: any): number;
}
import { Color } from "three/src/math/Color";
import { WebGLRenderTarget } from "three/src/renderers/WebGLRenderTarget";
import { Vector2 } from "three/src/math/Vector2";
