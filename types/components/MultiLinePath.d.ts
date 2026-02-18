import { Object3D, Vector3 } from "three";
import { Line } from "./Line";
export class MultiLinePath extends Object3D {
    constructor(paths: Array<Vector3[]>);
    paths: Line[];
}
