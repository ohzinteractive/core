import { GLTFDRACOLoader } from '../resource_loader/GLTFDRACOLoader';
import { GLTFLoader } from '../resource_loader/GLTFLoader';
import { AsyncAbstractLoader } from './AsyncAbstractLoader';
declare class AsyncObjectsLoader extends AsyncAbstractLoader {
    constructor(scene_name: string, assets: any[], worker: Worker);
    __setup_loaders(): (GLTFDRACOLoader | GLTFLoader)[];
}
export { AsyncObjectsLoader };
