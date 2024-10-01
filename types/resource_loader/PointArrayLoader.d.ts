export class PointArrayLoader extends AbstractLoader {
    constructor(resource_id: any, url: any, size: any);
    loader: FileLoader;
    on_preloaded_finished(resource_container: any): void;
    parse_path(raw_data: any): Vector3[];
}
import { AbstractLoader } from "./AbstractLoader";
import { FileLoader } from "three/src/loaders/FileLoader";
import { Vector3 } from "three/src/math/Vector3";
