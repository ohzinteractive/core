import type { Vector3 } from 'three';
import { Mesh } from 'three';
declare class Sphere extends Mesh {
    center: Vector3;
    color: string | number;
    radius: number;
    constructor(radius: number, color: number | string);
}
export { Sphere };
