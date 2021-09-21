export default class ObjectOrientedBoundingBox {
    constructor(points: any);
    axis_to_world: any;
    world_to_axis: any;
    min: any;
    max: any;
    center: any;
    bounds: any[];
    get_center(points: any): any;
    box_volume(min: any, max: any): number;
    getSize(): any;
    is_inside_XZ(point: any): boolean;
    closest_point_on_bounds(reference_point: any): any;
    world_to_local(point: any): any;
    local_to_world(point: any): any;
    local_to_world_dir(direction: any): any;
    get_corners(): any[];
}
