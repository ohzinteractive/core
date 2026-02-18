import type { Vector3 } from "three";
import { Mesh } from "three";

export class Arrow extends Mesh {
    constructor(color?: string | number, length?: number, dir?: Vector3);
    _dir: Vector3;

    set dir(arg: Vector3);
    get dir(): Vector3;
    set length(arg: number);
    get length(): number;
}
