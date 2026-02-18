import type { ResourceContainer } from "../../src/loaders/assets_loader/ResourceContainer";

export class AsyncAbstractLoader {
    static create_worker(): Worker;
    constructor(name: string, assets: any[], worker: Worker);
    resource_container: ResourceContainer;
    assets: any[];
    name: string;
    worker: Worker;
    bound_on_message: any;
    assets_loaders: any[];
    
    load(): void;
    is_loaded(): boolean;
    get_progress(): number;
    __get_loaded_bytes(): number;
    __get_total_bytes(): number;
    get_assets_names(): any[];
    __setup_worker(): void;
    on_message(e: MessageEvent): void;
    __on_assets_loaded(resources: any): void;
    __setup_loaders(): any[];
}
