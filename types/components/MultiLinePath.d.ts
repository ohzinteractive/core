import { Line } from './Line';
import type { Vector3 } from 'three';
import { Object3D } from 'three';
declare class MultiLinePath extends Object3D {
    paths: Line[];
    constructor(paths: Array<Vector3[]>);
}
export { MultiLinePath };
