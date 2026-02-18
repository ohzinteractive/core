import type { ResourceContainer } from '../loaders/assets_loader/ResourceContainer';
import { AbstractLoader } from './AbstractLoader';
import { DDSLoader as TDDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
declare class DDSLoader extends AbstractLoader {
    loader: TDDSLoader;
    constructor(resource_id: string, url: string, size: number);
    on_preloaded_finished(resource_container: ResourceContainer): void;
}
export { DDSLoader };
