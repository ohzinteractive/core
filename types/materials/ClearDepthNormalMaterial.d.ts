import { BlitNodeMaterial } from '../materials/BlitNodeMaterial';
import type { Vector3 } from 'three';
declare class ClearDepthNormalMaterial extends BlitNodeMaterial {
    constructor(clear_depth: number, clear_normal: Vector3);
}
export { ClearDepthNormalMaterial };
