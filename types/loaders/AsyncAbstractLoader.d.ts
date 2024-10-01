export class AsyncAbstractLoader {
    static create_worker(): Worker;
    /**
     * @param {string} name
     * @param {any[]} assets
     * @param {Worker} worker
     */
    constructor(name: string, assets: any[], worker: Worker);
    resource_container: {
        init(): void;
        resources: Record<string, import("../ResourceContainer").Resource>;
        resources_by_url: Record<string, any>;
        set_resource(name: string, url: string, resource: import("../ResourceContainer").Resource): void;
        get_resource(name: string): import("../ResourceContainer").Resource;
        get(name: string): import("../ResourceContainer").Resource;
    };
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
    /**
     * @param {MessageEvent} e
     */
    on_message(e: MessageEvent): void;
    /**
     * @param {any} resources
     */
    __on_assets_loaded(resources: any): void;
    /**
     * @returns {any[]}
     */
    __setup_loaders(): any[];
}
