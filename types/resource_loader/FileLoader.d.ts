import type { FileLoader as TFileLoader } from "three";
import { AbstractLoader } from "./AbstractLoader";
export class FileLoader extends AbstractLoader {
    constructor(resource_id: any, url: any, size: any);
    loader: TFileLoader;
    on_preloaded_finished(resource_container: any): void;
}
