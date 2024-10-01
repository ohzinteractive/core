export class GLTFDRACOLoader extends AbstractLoader {
    constructor(resource_id: any, url: any, loader: any, size: any);
    loader: GLTFLoader;
    on_preloaded_finished(resource_container: any): void;
}
import { AbstractLoader } from "./AbstractLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
