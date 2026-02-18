import type { Vector2 } from 'three';
import { Mesh, ShapeGeometry } from 'three';
declare class Shape2D extends Mesh {
    constructor(points_2D: Vector2[], show_edges: boolean);
    invert_normals(geometry: ShapeGeometry): void;
}
export { Shape2D };
