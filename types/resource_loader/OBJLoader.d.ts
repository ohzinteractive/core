import type { ResourceContainer } from '../loaders/assets_loader/ResourceContainer';
import { AbstractLoader } from './AbstractLoader';
import { OBJLoader as TOBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
declare class OBJLoader extends AbstractLoader {
    loader: TOBJLoader;
    resource_id: string;
    url: string;
    constructor(resource_id: string, url: string, size: number);
    on_preloaded_finished(resource_container: ResourceContainer): void;
}
export { OBJLoader };
