import type { ResourceContainer } from "../loaders/assets_loader/ResourceContainer";
export type LoaderResourceContainer = Pick<ResourceContainer, 'resources_by_url' | 'set_resource'>;
export declare class AbstractLoader {
    resource_id: string;
    url: string;
    loaded_bytes: number;
    total_bytes: number;
    has_finished: boolean;
    has_error: boolean;
    error_message: string;
    constructor(resource_id: string, url: string, size?: number);
    __update_downloaded_bytes(loaded: number, total: number): void;
    __loading_ended(): void;
    __set_error(message: string): void;
    print_error(): void;
    load(resource_container: LoaderResourceContainer): void;
    on_progress(resource_container: LoaderResourceContainer, response: Response): Promise<void>;
    on_preloaded_finished(resource_container: LoaderResourceContainer, response: Response): void;
    __on_error(data: any): void;
    is_int(n: any): boolean;
    is_float(n: any): boolean;
    is_number(n: any): boolean;
}
