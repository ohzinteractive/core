import { Mesh, Object3D, Vector3 } from "three";
export class BaseObject extends Object3D {
    constructor();
    ___temp_w_pos: Vector3;
    get_world_pos(): Vector3;
    deep_dispose(obj: Object3D | Mesh): void;
}
