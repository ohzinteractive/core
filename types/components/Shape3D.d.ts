export class Shape3D extends Mesh<import("three").BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material | import("three").Material[], import("three").Object3DEventMap> {
    /**
     * @param {Vector2[]} points_2D
     * @param {boolean} show_edges
     * @param {number} [height]
     */
    constructor(points_2D: Vector2[], show_edges: boolean, height?: number);
}
import { Mesh } from "three/src/objects/Mesh";
import { Vector2 } from "three/src/math/Vector2";
