import { AbstractLoader } from "./AbstractLoader";

export class AudioLoader extends AbstractLoader {
    constructor(resource_id: string, url: string, loop: boolean, volume: number, size: number, positional: boolean);
    loader: any;
    loop: boolean;
    volume: number;
}
