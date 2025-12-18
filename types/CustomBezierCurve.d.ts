export class CustomBezierCurve {
    /**
     * @param {Vector3[]} points
     */
    constructor(points: Vector3[]);
    original_points: Vector3[];
    tmp_points: Vector3[];
    /**
     * @param {number} point_amount
     * @returns {Vector3[]}
     */
    build(point_amount: number): Vector3[];
    /**
     * @param {number} t
     * @returns {Vector3}
     */
    get_point_at(t: number): Vector3;
}
import { Vector3 } from "three/src/math/Vector3";
