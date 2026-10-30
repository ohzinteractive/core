import type { ResourceContainer } from '../loaders/assets_loader/ResourceContainer';
import { AbstractLoader } from './AbstractLoader';
import { FileLoader, Vector3 } from 'three';
declare class PointArrayLoader extends AbstractLoader {
    loader: FileLoader;
    resource_id: string;
    url: string;
    constructor(resource_id: string, url: string, size: number);
    on_preloaded_finished(resource_container: ResourceContainer): void;
    parse_path(raw_data: string): Vector3[];
}
export { PointArrayLoader };
