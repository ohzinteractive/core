import type { Vector2 } from 'three';
import { Mesh } from 'three';
declare class Shape3D extends Mesh {
    constructor(points_2D: Vector2[], show_edges: boolean, height?: number);
}
export { Shape3D };
