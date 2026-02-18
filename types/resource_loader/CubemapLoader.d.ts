import type { CubeTextureLoader } from "three";
import { AbstractLoader } from "./AbstractLoader";
export class CubemapLoader extends AbstractLoader {
    constructor(resource_id: any, url: any, extension: any, size: any);
    loader: CubeTextureLoader;
    urls: string[];
    on_preloaded_finished(resource_container: any): void;
}
