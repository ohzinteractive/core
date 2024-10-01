export class AsyncAudiosLoader extends AsyncAbstractLoader {
    constructor(scene_name: any, assets: any, worker: any);
    __setup_loaders(): AudioLoader[];
}
import { AsyncAbstractLoader } from "./AsyncAbstractLoader";
import { AudioLoader } from "../resource_loader/AudioLoader";
