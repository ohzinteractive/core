export class Line extends Mesh<BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material | import("three").Material[], import("three").Object3DEventMap> {
    /**
     * @param {Vector3[]} [points]
     */
    constructor(points?: Vector3[]);
    material: ShaderMaterial;
    /**
     * @param {Vector3[]} points
     */
    setup(points: Vector3[]): void;
    _length: number;
    accumulated_length: number;
    set thickness(arg: any);
    get thickness(): any;
    /**
     * @param {Vector3[]} points
     * @param {number} i
     * @returns {Vector3}
     */
    __get_previous_position(points: Vector3[], i: number): Vector3;
    /**
     * @param {Vector3[]} points
     * @param {number} i
     * @returns {Vector3}
     */
    __get_next_position(points: Vector3[], i: number): Vector3;
    update(): void;
    distance(): number;
    total_length(): number;
    dispose(): void;
    set color(arg: any);
    get color(): any;
    /**
     * @param {Color} col
     */
    copy_color(col: Color): void;
}
import { BufferGeometry } from "three/src/core/BufferGeometry";
import { Mesh } from "three/src/objects/Mesh";
import { ShaderMaterial } from "three/src/materials/ShaderMaterial";
import { Vector3 } from "three/src/math/Vector3";
import { Color } from "three/src/math/Color";
