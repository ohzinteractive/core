export default class AbstractLoader {
    constructor(resource_id: any, url: any, size?: number);
    resource_id: any;
    url: any;
    loaded_bytes: number;
    total_bytes: number;
    has_finished: boolean;
    has_error: boolean;
    error_message: string;
    __update_downloaded_bytes(loaded: any, total: any): void;
    __loading_ended(): void;
    __set_error(message: any): void;
    print_error(): void;
    load(resource_container: any): void;
    on_progress(resource_container: any, response: any): Promise<void>;
    on_preloaded_finished(resource_container: any): void;
    __on_error(data: any): void;
}
