import type { DataTexture, Vector3 } from "three";
import { BlitMaterial } from "../materials/BlitMaterial";
export class SSAOMaterial extends BlitMaterial {
    constructor();
    __get_sample_kernel(): Vector3[];
    __get_rotation_kernel(): DataTexture;
}
