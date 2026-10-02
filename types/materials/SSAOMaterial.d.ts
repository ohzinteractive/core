import type { DataTexture, Vector3 } from "three";
import { BlitNodeMaterial } from "../materials/BlitNodeMaterial";
export class SSAOMaterial extends BlitNodeMaterial {
    constructor();
    __get_sample_kernel(): Vector3[];
    __get_rotation_kernel(): DataTexture;
}
