declare var _default: ModelUtilities;
export default _default;
declare class ModelUtilities {
    get_mesh(scene: any, result_callback: any): void;
    get_geometries(scene: any): any[];
    assign_material(scene: any, material: any, name: any): void;
    clone_animated_gltf(gltf: any): {
        animations: any;
        scene: any;
    };
    set_shadow_config(scene: any, cast: any, receive: any): void;
    __find_object(scene: any, object_name: any, result_callback: any): void;
    get_object(scene: any, object_name: any): any;
    get_object_by_type(scene: any, object_type: any): any;
}
