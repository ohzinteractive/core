import type { Vector3 } from "three";
import { Mesh } from "three";
export class Sphere extends Mesh {
    constructor(radius: number, color: number | string);

    radius: number;
    color: string | number;
    center: Vector3;
}
