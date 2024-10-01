export class Shape2D extends Mesh<import("three").BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material | import("three").Material[], import("three").Object3DEventMap> {
    /**
     * @param {Vector2[]} points_2D
     * @param {boolean} show_edges
     */
    constructor(points_2D: Vector2[], show_edges: boolean);
    /**
     * @param {ShapeGeometry} geometry
     */
    invert_normals(geometry: ShapeGeometry): void;
}
import { Mesh } from "three/src/objects/Mesh";
import { ShapeGeometry } from "three/src/geometries/ShapeGeometry";
import { Vector2 } from "three/src/math/Vector2";
