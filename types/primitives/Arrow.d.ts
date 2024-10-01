export class Arrow extends Mesh<import("three").BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material | import("three").Material[], import("three").Object3DEventMap> {
    /**
     * @param {string | number} [color]
     * @param {number} [length]
     * @param {Vector3} [dir]
     */
    constructor(color?: string | number, length?: number, dir?: Vector3);
    _dir: Vector3;
    set dir(arg: Vector3);
    get dir(): Vector3;
    set length(arg: number);
    get length(): number;
}
import { Mesh } from "three/src/objects/Mesh";
import { Vector3 } from "three/src/math/Vector3";
