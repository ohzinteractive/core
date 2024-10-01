export class SVGLoader extends AbstractLoader {
    constructor(resource_id: any, url: any, size: any);
    loader: TSVGLoader;
    on_preloaded_finished(resource_container: any): void;
}
import { AbstractLoader } from "./AbstractLoader";
import { SVGLoader as TSVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
