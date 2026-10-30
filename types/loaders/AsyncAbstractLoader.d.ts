declare class AsyncAbstractLoader {
    assets: any[];
    assets_loaders: any[];
    bound_on_message: any;
    name: string;
    resource_container: any;
    worker: Worker;
    constructor(name: string, assets: any[], worker: Worker);
    load(): void;
    is_loaded(): boolean;
    get_progress(): number;
    __get_loaded_bytes(): number;
    __get_total_bytes(): number;
    get_assets_names(): any[];
    static create_worker(): Worker;
    __setup_worker(): void;
    on_message(e: any): void;
    __on_assets_loaded(resources: any): void;
    __setup_loaders(): any[];
}
export { AsyncAbstractLoader };
