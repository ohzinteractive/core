import type { ResourceContainer } from '../loaders/assets_loader/ResourceContainer';
import { AbstractLoader } from './AbstractLoader';
declare class AudioLoader extends AbstractLoader {
    loop: boolean;
    volume: number;
    positional: boolean;
    constructor(resource_id: string, url: string, loop: boolean, volume: number, size: number, positional?: boolean);
    on_preloaded_finished(resource_container: ResourceContainer): void;
    instantiate_audio(resource_container: ResourceContainer): void;
}
export { AudioLoader };
