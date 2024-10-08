export class DAELoader extends AbstractLoader {
    constructor(resource_id: any, url: any, size: any);
    loader: ColladaLoader;
    on_preloaded_finished(resource_container: any): void;
}
import { AbstractLoader } from "./AbstractLoader";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader.js";
