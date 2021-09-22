import { AbstractLoader } from "./AbstractLoader";

export class AudioLoader extends AbstractLoader {
    constructor(resource_id: any, url: any, loop: boolean, volume: number, size: any);
    loader: any;
    loop: boolean;
    volume: number;
}
