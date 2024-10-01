export class HDRCubeTextureLoader extends AbstractLoader {
    constructor(resource_id: any, url: any, extension: any, size: any);
    loader: THDRCubeTextureLoader;
    urls: string[];
    on_preloaded_finished(resource_container: any): void;
}
import { AbstractLoader } from "./AbstractLoader";
import { HDRCubeTextureLoader as THDRCubeTextureLoader } from "three/examples/jsm/loaders/HDRCubeTextureLoader.js";
