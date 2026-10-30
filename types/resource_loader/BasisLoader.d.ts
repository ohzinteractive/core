import type { ResourceContainer } from '../loaders/assets_loader/ResourceContainer';
import { AbstractLoader } from './AbstractLoader';
declare class BasisLoader extends AbstractLoader {
    loader: any;
    resource_id: string;
    url: string;
    constructor(resource_id: string, url: string, loader: any, size: number);
    on_preloaded_finished(resource_container: ResourceContainer): void;
}
export { BasisLoader };
