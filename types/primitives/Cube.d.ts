export class Cube extends Mesh<import("three").BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material | import("three").Material[], import("three").Object3DEventMap> {
    /**
     * @param {Vector3} [size]
     * @param {Vector3} [segments]
     * @param {number | string} [color]
     */
    constructor(size?: Vector3, segments?: Vector3, color?: number | string);
}
import { Mesh } from "three/src/objects/Mesh";
import { Vector3 } from "three/src/math/Vector3";
