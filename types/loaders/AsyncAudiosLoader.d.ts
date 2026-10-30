import { AudioLoader } from '../resource_loader/AudioLoader';
import { AsyncAbstractLoader } from './AsyncAbstractLoader';
declare class AsyncAudiosLoader extends AsyncAbstractLoader {
    constructor(scene_name: string, assets: any[], worker: Worker);
    __setup_loaders(): AudioLoader[];
}
export { AsyncAudiosLoader };
