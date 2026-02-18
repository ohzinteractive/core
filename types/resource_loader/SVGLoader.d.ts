import type { ResourceContainer } from '../loaders/assets_loader/ResourceContainer';
import { AbstractLoader } from './AbstractLoader';
import { SVGLoader as TSVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
declare class SVGLoader extends AbstractLoader {
    loader: TSVGLoader;
    constructor(resource_id: string, url: string, size: number);
    on_preloaded_finished(resource_container: ResourceContainer): void;
}
export { SVGLoader };
