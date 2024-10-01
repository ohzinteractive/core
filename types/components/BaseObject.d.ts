export class BaseObject extends Object3D<import("three").Object3DEventMap> {
    constructor();
    ___temp_w_pos: Vector3;
    get_world_pos(): Vector3;
    /**
     * @param {Object3D | Mesh} obj
     */
    deep_dispose(obj: Object3D | Mesh): void;
}
import { Object3D } from "three/src/core/Object3D";
import { Vector3 } from "three/src/math/Vector3";
import { Mesh } from "three/src/objects/Mesh";
