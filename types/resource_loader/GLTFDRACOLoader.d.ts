import type { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import type { ResourceContainer } from '../loaders/assets_loader/ResourceContainer';
import { AbstractLoader } from './AbstractLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
declare class GLTFDRACOLoader extends AbstractLoader {
    loader: GLTFLoader;
    constructor(resource_id: string, url: string, loader: DRACOLoader, size: number);
    on_preloaded_finished(resource_container: ResourceContainer): void;
}
export { GLTFDRACOLoader };
