export class GLTFLoader extends AbstractLoader {
    constructor(resource_id: any, url: any, size: any);
    loader: TGLTFLoader;
    on_preloaded_finished(resource_container: any): void;
}
import { AbstractLoader } from "./AbstractLoader";
import { GLTFLoader as TGLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
