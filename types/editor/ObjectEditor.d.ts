export default class ObjectEditor {
    constructor(renderer: any, scene: any, camera: any);
    raycaster: any;
    selected_object: any;
    object_manipulator: ObjectManipulator;
    object_picker: ObjectPicker;
    scene: any;
    camera: any;
    selectable_objects: any[];
    refresh_scene(): void;
    update(): void;
    __populate_selectable_objects(array: any): void;
    __set_object_ids(array: any): void;
}
import ObjectManipulator from "./ObjectManipulator";
import ObjectPicker from "./ObjectPicker";
