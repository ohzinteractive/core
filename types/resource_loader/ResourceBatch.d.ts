export class ResourceBatch {
    constructor(batch_name: any);
    resource_loaders: any[];
    batch_name: any;
    add_texture(resource_id: any, url: any, size: any): void;
    add_gltf(resource_id: any, url: any, size: any): void;
    add_basis(resource_id: any, url: any, renderer: any, loader: any, size: any): void;
    add_gltf_draco(resource_id: any, url: any, size: any): void;
    add_dae(resource_id: any, url: any, size: any): void;
    add_obj(resource_id: any, url: any, size: any): void;
    add_file(resource_id: any, url: any, size: any): void;
    add_text(resource_id: any, url: any, size: any): void;
    add_cubemap(resource_id: any, url: any, size: any): void;
    add_audio(resource_id: any, url: any, loop: any, volume: any, size: any): void;
    add_json(resource_id: any, url: any, size: any): void;
    add_point_array(resource_id: any, url: any, size: any): void;
    add_hdr(resource_id: any, url: any, size: any): void;
    add_hdr_cubemap(resource_id: any, url: any, size: any): void;
    add_font(resource_id: any, url: any, size: any): void;
    add_loader(loader: any): void;
    load(resource_container: any): void;
    get loading_finished(): boolean;
    get has_errors(): boolean;
    print_errors(): void;
    get_progress(): number;
    get_loaded_bytes(): number;
    get_total_bytes(): number;
}
