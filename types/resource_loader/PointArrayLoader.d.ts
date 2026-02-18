import type { FileLoader, Vector3 } from "three";
import { AbstractLoader } from "./AbstractLoader";
export class PointArrayLoader extends AbstractLoader {
    constructor(resource_id: any, url: any, size: any);
    loader: FileLoader;
    on_preloaded_finished(resource_container: any): void;
    parse_path(raw_data: any): Vector3[];
}
