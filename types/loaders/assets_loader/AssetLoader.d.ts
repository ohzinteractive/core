import { AbstractLoader } from '../../resource_loader/AbstractLoader';
import type { ResourceContainer } from './ResourceContainer';
export declare class AssetLoader extends AbstractLoader {
    constructor(resource_id: string, url: string, size: number);
    on_preloaded_finished(resource_container: ResourceContainer, response: Response): void;
}
