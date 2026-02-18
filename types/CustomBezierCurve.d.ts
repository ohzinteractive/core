import { Vector3 } from 'three';
declare class CustomBezierCurve {
    original_points: Vector3[];
    tmp_points: Vector3[];
    constructor(points: Vector3[]);
    build(point_amount: number): Vector3[];
    get_point_at(t: number): Vector3;
}
export { CustomBezierCurve };
