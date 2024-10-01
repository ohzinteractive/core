export class ObjectOrientedBoundingBox {
    /**
     * @param {Vector3[]} points
     */
    constructor(points: Vector3[]);
    axis_to_world: Quaternion;
    world_to_axis: Quaternion;
    min: Vector3;
    max: Vector3;
    center: Vector3;
    bounds: Vector3[];
    /**
     * @param {Vector3[]} points
     */
    get_center(points: Vector3[]): Vector3;
    /**
     * @param {Vector3} min
     * @param {Vector3} max
     */
    box_volume(min: Vector3, max: Vector3): number;
    getSize(): Vector3;
    /**
     * @param {Vector3} point
     */
    is_inside_XZ(point: Vector3): boolean;
    /**
     * @param {Vector3} reference_point
     */
    closest_point_on_bounds(reference_point: Vector3): Vector3;
    /**
     * @param {Vector3} point
     */
    world_to_local(point: Vector3): Vector3;
    /**
     * @param {Vector3} point
     */
    local_to_world(point: Vector3): Vector3;
    /**
     * @param {Vector3} direction
     */
    local_to_world_dir(direction: Vector3): Vector3;
    get_corners(): Vector3[];
}
import { Quaternion } from "three/src/math/Quaternion";
import { Vector3 } from "three/src/math/Vector3";
