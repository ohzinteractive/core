import type { ResourceContainer } from '../loaders/assets_loader/ResourceContainer';
import { AbstractLoader } from './AbstractLoader';
import { GLTFLoader as TGLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
declare class GLTFLoader extends AbstractLoader {
    loader: TGLTFLoader;
    constructor(resource_id: string, url: string, size: number);
    on_preloaded_finished(resource_container: ResourceContainer): void;
}
export { GLTFLoader };
