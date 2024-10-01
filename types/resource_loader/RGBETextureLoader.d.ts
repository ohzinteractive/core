export class RGBETextureLoader extends AbstractLoader {
    constructor(resource_id: any, url: any, size: any);
    loader: RGBELoader;
    on_preloaded_finished(resource_container: any): void;
}
import { AbstractLoader } from "./AbstractLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
