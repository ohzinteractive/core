export class AsyncTexturesLoader extends AsyncAbstractLoader {
    constructor(scene_name: any, assets: any, worker: any);
    __setup_loaders(): (AsyncTextureLoader | BasisLoader | CubemapLoader | RGBETextureLoader)[];
}
import { AsyncAbstractLoader } from "./AsyncAbstractLoader";
import { AsyncTextureLoader } from "../resource_loader/AsyncTextureLoader";
import { BasisLoader } from "../resource_loader/BasisLoader";
import { CubemapLoader } from "../resource_loader/CubemapLoader";
import { RGBETextureLoader } from "../resource_loader/RGBETextureLoader";
