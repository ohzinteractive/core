export class AsyncAbstractLoader {
    static create_worker(): Worker;
    constructor(name: any, assets: any, worker: any);
    resource_container: {
        init(): void;
        resources: {};
        resources_by_url: {};
        set_resource(name: any, url: any, resource: any): void;
        get_resource(name: any): any;
        get(name: any): any;
    };
    assets: any;
    name: any;
    worker: any;
    bound_on_message: any;
    assets_loaders: void;
    load(): void;
    is_loaded(): boolean;
    get_progress(): number;
    __get_loaded_bytes(): number;
    __get_total_bytes(): number;
    get_assets_names(): any[];
    __setup_worker(): void;
    on_message(e: any): void;
    __on_assets_loaded(resources: any): void;
    __setup_loaders(): void;
}
