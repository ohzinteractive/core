import type { ResourceContainer } from '../loaders/assets_loader/ResourceContainer';
import { AbstractLoader } from './AbstractLoader';
import { FontLoader as TFontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
declare class FontLoader extends AbstractLoader {
    loader: TFontLoader;
    resource_id: string;
    url: string;
    constructor(resource_id: string, url: string, size: number);
    on_preloaded_finished(resource_container: ResourceContainer): void;
}
export { FontLoader };
