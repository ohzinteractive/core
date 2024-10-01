export class MultiLinePath extends Object3D<import("three").Object3DEventMap> {
    /**
     * @param {Array<Vector3[]>} paths
     */
    constructor(paths: Array<Vector3[]>);
    paths: Line[];
}
import { Object3D } from "three/src/core/Object3D";
import { Line } from "./Line";
import { Vector3 } from "three/src/math/Vector3";
