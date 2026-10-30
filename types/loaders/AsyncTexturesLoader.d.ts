import { AsyncTextureLoader } from '../resource_loader/AsyncTextureLoader';
import { BasisLoader } from '../resource_loader/BasisLoader';
import { CubemapLoader } from '../resource_loader/CubemapLoader';
import { HDRCubeTextureLoader } from '../resource_loader/HDRCubeTextureLoader';
import { HDRTextureLoader } from '../resource_loader/HDRTextureLoader';
import { AsyncAbstractLoader } from './AsyncAbstractLoader';
declare class AsyncTexturesLoader extends AsyncAbstractLoader {
    constructor(scene_name: string, assets: any[], worker: Worker);
    __setup_loaders(): (AsyncTextureLoader | BasisLoader | CubemapLoader | HDRCubeTextureLoader | HDRTextureLoader)[];
}
export { AsyncTexturesLoader };
