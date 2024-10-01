export class HorizontalPlane extends Mesh<import("three").BufferGeometry<import("three").NormalBufferAttributes>, Material | Material[], import("three").Object3DEventMap> {
    /**
     * @param {number} [width]
     * @param {number} [height]
     * @param {number | string} [color]
     * @param {Material} [material]
     */
    constructor(width?: number, height?: number, color?: number | string, material?: Material);
}
import { Material } from "three/src/materials/Material";
import { Mesh } from "three/src/objects/Mesh";
