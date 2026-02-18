import type { ResourceContainer } from "./ResourceContainer";
declare class ResourceBatch {
    resource_loaders: Array<any>;
    batch_name: string;
    resource_container: ResourceContainer;
    constructor(batch_name: string, resource_container: ResourceContainer);
    add_loader(loader: any): void;
    load(): void;
    get loading_finished(): boolean;
    get has_errors(): boolean;
    print_errors(): void;
    get_progress(): number;
    get_loaded_bytes(): number;
    get_total_bytes(): number;
}
export { ResourceBatch };
