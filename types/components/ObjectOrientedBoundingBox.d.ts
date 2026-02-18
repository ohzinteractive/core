import { Quaternion, Vector3 } from 'three';
declare class ObjectOrientedBoundingBox {
    axis_to_world: Quaternion;
    bounds: Vector3[];
    center: Vector3;
    max: Vector3;
    min: Vector3;
    world_to_axis: Quaternion;
    constructor(points: Vector3[]);
    get_center(points: Vector3[]): Vector3;
    box_volume(min: Vector3, max: Vector3): number;
    getSize(): Vector3;
    is_inside_XZ(point: Vector3): boolean;
    closest_point_on_bounds(reference_point: Vector3): Vector3;
    world_to_local(point: Vector3): Vector3;
    local_to_world(point: Vector3): Vector3;
    local_to_world_dir(direction: Vector3): Vector3;
    get_corners(): Vector3[];
}
export { ObjectOrientedBoundingBox };
