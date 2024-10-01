export class OBJLoader extends AbstractLoader {
    constructor(resource_id: any, url: any, size: any);
    loader: TOBJLoader;
    on_preloaded_finished(resource_container: any): void;
}
import { AbstractLoader } from "./AbstractLoader";
import { OBJLoader as TOBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
