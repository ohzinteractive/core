import type { AbstractScene } from '../scenes/AbstractScene';
declare class ModelUtilities {
    get_mesh(scene: AbstractScene, result_callback: any): void;
    get_geometries(scene: AbstractScene): any;
    assign_material(scene: AbstractScene, material: any, name: any): void;
    clone_animated_gltf(gltf: any): {
        animations: any;
        scene: any;
    };
    set_shadow_config(scene: any, cast: any, receive: any): void;
    __find_object(scene: any, object_name: any, result_callback: any): void;
    get_object(scene: any, object_name: any): any;
    get_object_by_type(scene: any, object_type: any): any;
}
declare const model_utilities: ModelUtilities;
export { model_utilities as ModelUtilities };
