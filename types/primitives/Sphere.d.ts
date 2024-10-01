export class Sphere extends Mesh<import("three").BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material | import("three").Material[], import("three").Object3DEventMap> {
    /**
     * @param {number} radius
     * @param {number | string} color
     */
    constructor(radius: number, color: number | string);
    radius: number;
    color: string | number;
    center: import("three").Vector3;
}
import { Mesh } from "three/src/objects/Mesh";
