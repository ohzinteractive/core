export class CubemapLoader extends AbstractLoader {
    constructor(resource_id: any, url: any, extension: any, size: any);
    loader: any;
    urls: string[];
    on_preloaded_finished(resource_container: any): void;
}
import { AbstractLoader } from "./AbstractLoader";
