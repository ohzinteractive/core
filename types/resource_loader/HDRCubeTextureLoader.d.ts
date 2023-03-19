export class HDRCubeTextureLoader extends AbstractLoader {
    constructor(resource_id: any, url: any, size: any);
    loader: any;
    url_suffix: string[];
    on_preloaded_finished(resource_container: any): void;
}
import { AbstractLoader } from "./AbstractLoader";
