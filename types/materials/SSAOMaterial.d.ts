export class SSAOMaterial extends BlitMaterial {
    constructor();
    __get_sample_kernel(): Vector3[];
    __get_rotation_kernel(): DataTexture;
}
import { BlitMaterial } from "../materials/BlitMaterial";
import { Vector3 } from "three/src/math/Vector3";
import { DataTexture } from "three/src/textures/DataTexture";
