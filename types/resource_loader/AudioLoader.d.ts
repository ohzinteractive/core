export class AudioLoader extends AbstractLoader {
    constructor(resource_id: any, url: any, loop: boolean, volume: number, size: any, positional?: boolean);
    loop: boolean;
    volume: number;
    positional: boolean;
    instantiate_audio(resource_container: any): void;
}
import { AbstractLoader } from "./AbstractLoader";
