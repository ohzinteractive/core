 export class ModelUtilities {
    static get_mesh(scene: any, result_callback: any): void;
    static get_geometries(scene: any): any[];
    static assign_material(scene: any, material: any, name: any): void;
    static clone_animated_gltf(gltf: any): {
        animations: any;
        scene: any;
    };
    static set_shadow_config(scene: any, cast: any, receive: any): void;
    static __find_object(scene: any, object_name: any, result_callback: any): void;
    static get_object(scene: any, object_name: any): any;
    static get_object_by_type(scene: any, object_type: any): any;
}
