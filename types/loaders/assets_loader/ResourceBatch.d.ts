export class ResourceBatch {
    constructor(batch_name: any, resource_container: any);
    resource_loaders: any[];
    batch_name: any;
    resource_container: any;
    add_loader(loader: any): void;
    load(): void;
    get loading_finished(): boolean;
    get has_errors(): boolean;
    print_errors(): void;
    get_progress(): number;
    get_loaded_bytes(): number;
    get_total_bytes(): number;
}
