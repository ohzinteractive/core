import type { ResourceContainer } from '../loaders/assets_loader/ResourceContainer';
import { AbstractLoader } from './AbstractLoader';
declare class JSONLoader extends AbstractLoader {
    resource_id: string;
    url: string;
    constructor(resource_id: string, url: string, size: number);
    on_preloaded_finished(resource_container: ResourceContainer): void;
}
export { JSONLoader };
