import type { Mesh } from 'three';
import { Object3D, Vector3 } from 'three';
declare class BaseObject extends Object3D {
    ___temp_w_pos: Vector3;
    constructor();
    get_world_pos(): Vector3;
    deep_dispose(obj: Object3D | Mesh): void;
}
export { BaseObject };
