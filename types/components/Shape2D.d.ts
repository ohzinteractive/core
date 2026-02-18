import { Mesh, ShapeGeometry, Vector2 } from "three";

export class Shape2D extends Mesh {
    constructor(points_2D: Vector2[], show_edges: boolean);

    invert_normals(geometry: ShapeGeometry): void;
}

