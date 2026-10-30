import type { ResourceContainer } from '../loaders/assets_loader/ResourceContainer';
import { AbstractLoader } from './AbstractLoader';
export declare class AsyncTextureLoader extends AbstractLoader {
    original_url: string;
    colorSpaceConversion: boolean;
    premultiplyAlpha: boolean;
    flipY: boolean;
    constructor(resource_id: string, url: string, size: number, flipY?: boolean, premultiplyAlpha?: boolean, colorSpaceConversion?: boolean);
    on_preloaded_finished(resource_container: ResourceContainer): void;
    load_with_old_method(resource_container: ResourceContainer): void;
    load_with_new_method(resource_container: ResourceContainer): void;
}
