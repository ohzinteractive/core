import type { ResourceContainer } from '../loaders/assets_loader/ResourceContainer';
import { AbstractLoader } from './AbstractLoader';
import { HDRCubeTextureLoader as THDRCubeTextureLoader } from 'three/examples/jsm/loaders/HDRCubeTextureLoader.js';
declare class HDRCubeTextureLoader extends AbstractLoader {
    loader: THDRCubeTextureLoader;
    urls: string[];
    constructor(resource_id: string, url: string, extension: string, size: number);
    on_preloaded_finished(resource_container: ResourceContainer): void;
}
export { HDRCubeTextureLoader };
