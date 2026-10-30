import { Mesh, Vector3 } from 'three';
declare class Arrow extends Mesh {
    _dir: Vector3;
    constructor(color?: string | number, length?: number, dir?: Vector3);
    set dir(dir: Vector3);
    get dir(): Vector3;
    set length(value: number);
    get length(): number;
}
export { Arrow };
