export class PointArrayLoader extends AbstractLoader {
    constructor(resource_id: any, url: any, size: any);
    loader: any;
    on_preloaded_finished(resource_container: any): void;
    parse_path(raw_data: any): any[];
}
import { AbstractLoader } from "./AbstractLoader";
