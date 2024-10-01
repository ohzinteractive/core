export class DDSLoader extends AbstractLoader {
    constructor(resource_id: any, url: any, size: any);
    loader: TDDSLoader;
    on_preloaded_finished(resource_container: any): void;
}
import { AbstractLoader } from "./AbstractLoader";
import { DDSLoader as TDDSLoader } from "three/examples/jsm/loaders/DDSLoader.js";
