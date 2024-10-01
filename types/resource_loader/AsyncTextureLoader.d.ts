export class AsyncTextureLoader extends AbstractLoader {
    constructor(resource_id: any, url: any, size: any, flipY?: boolean, premultiplyAlpha?: boolean, colorSpaceConversion?: boolean);
    original_url: string;
    colorSpaceConversion: boolean;
    premultiplyAlpha: boolean;
    flipY: boolean;
    on_preloaded_finished(resource_container: any): void;
    load_with_old_method(resource_container: any): void;
    load_with_new_method(resource_container: any): void;
}
import { AbstractLoader } from "./AbstractLoader";
