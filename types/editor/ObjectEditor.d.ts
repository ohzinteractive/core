export class ObjectEditor {
    constructor(renderer: any, scene: any, camera: any, input: any);
    raycaster: Raycaster;
    selected_object: any;
    object_manipulator: ObjectManipulator;
    object_picker: ObjectPicker;
    scene: any;
    camera: any;
    input: any;
    selectable_objects: any[];
    refresh_scene(): void;
    update(): void;
    __populate_selectable_objects(array: any): void;
    __set_object_ids(array: any): void;
}
import { Raycaster } from "three/src/core/Raycaster";
import { ObjectManipulator } from "./ObjectManipulator";
import { ObjectPicker } from "./ObjectPicker";
