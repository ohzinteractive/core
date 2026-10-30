import type { AbstractLoader, LoaderResourceContainer } from './AbstractLoader';
declare class ResourceBatch {
    resource_loaders: AbstractLoader[];
    batch_name: string;
    constructor(batch_name: string);
    add_loader(loader: AbstractLoader): void;
    load(resource_container?: LoaderResourceContainer): void;
    get loading_finished(): boolean;
    get has_errors(): boolean;
    print_errors(): void;
    get_progress(): number;
    get_loaded_bytes(): number;
    get_total_bytes(): number;
}
export { ResourceBatch };
