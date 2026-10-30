import type { ResourceContainer } from '../loaders/assets_loader/ResourceContainer';
import { AbstractLoader } from './AbstractLoader';
import { FileLoader as TFileLoader } from 'three';
declare class TextLoader extends AbstractLoader {
    loader: TFileLoader;
    constructor(resource_id: string, url: string, size: number);
    on_preloaded_finished(resource_container: ResourceContainer): void;
}
export { TextLoader };
