export class FontLoader extends AbstractLoader {
    constructor(resource_id: any, url: any, size: any);
    loader: TFontLoader;
    on_preloaded_finished(resource_container: any): void;
}
import { AbstractLoader } from "./AbstractLoader";
import { FontLoader as TFontLoader } from "three/examples/jsm/loaders/FontLoader.js";
