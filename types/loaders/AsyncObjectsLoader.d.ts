export class AsyncObjectsLoader extends AsyncAbstractLoader {
    __setup_loaders(): (GLTFDRACOLoader | GLTFLoader)[];
}
import { AsyncAbstractLoader } from "./AsyncAbstractLoader";
import { GLTFDRACOLoader } from "../resource_loader/GLTFDRACOLoader";
import { GLTFLoader } from "../resource_loader/GLTFLoader";
