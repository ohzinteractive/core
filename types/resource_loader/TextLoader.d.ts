export class TextLoader extends AbstractLoader {
    constructor(resource_id: any, url: any, size: any);
    loader: TFileLoader;
    on_preloaded_finished(resource_container: any): void;
}
import { AbstractLoader } from "./AbstractLoader";
import { FileLoader as TFileLoader } from "three/src/loaders/FileLoader";
