export class AudioLoader extends AbstractLoader {
    constructor(resource_id: any, url: any, loop: boolean, volume: number, size: any, positional?: boolean);
    loop: boolean;
    volume: number;
    positional: boolean;
    on_preloaded_finished(resource_container: any): void;
    instantiate_audio(resource_container: any): void;
}
import { AbstractLoader } from "./AbstractLoader";
