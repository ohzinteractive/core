import { Mesh, Vector2 } from "three";

export class Shape3D extends Mesh {
    constructor(points_2D: Vector2[], show_edges: boolean, height?: number);
}

