export class HDRTextureLoader extends AbstractLoader {
    constructor(resource_id: any, url: any, size: any);
    loader: HDRLoader;
    on_preloaded_finished(resource_container: any): void;
}
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import { AbstractLoader } from "./AbstractLoader";

