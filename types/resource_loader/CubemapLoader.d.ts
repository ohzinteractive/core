import type { ResourceContainer } from '../loaders/assets_loader/ResourceContainer';
import { AbstractLoader } from './AbstractLoader';
import { CubeTextureLoader } from 'three';
declare class CubemapLoader extends AbstractLoader {
    loader: CubeTextureLoader;
    urls: string[];
    constructor(resource_id: string, url: string, extension: string, size: number);
    on_preloaded_finished(resource_container: ResourceContainer): void;
}
export { CubemapLoader };
