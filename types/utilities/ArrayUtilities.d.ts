import type { Vector3 } from "three";
declare class ArrayUtilities {
    constructor();
    static merge_from_to<T>(source: Array<T>, target: Array<T>): void;
    static expand_vec3_array(array: Array<Vector3>, size: number): void;
    static remove_elem<T>(array: Array<T>, elem: T): void;
    static get_closest_point(points: Array<Vector3>, target: Vector3): Vector3;
    static object_values_to_array<T>(obj: {
        [key: string]: T;
    }): Array<T>;
}
export { ArrayUtilities };
