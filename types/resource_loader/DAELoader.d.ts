import type { ResourceContainer } from '../loaders/assets_loader/ResourceContainer';
import { AbstractLoader } from './AbstractLoader';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
declare class DAELoader extends AbstractLoader {
    loader: ColladaLoader;
    constructor(resource_id: string, url: string, size: number);
    on_preloaded_finished(resource_container: ResourceContainer): void;
}
export { DAELoader };
