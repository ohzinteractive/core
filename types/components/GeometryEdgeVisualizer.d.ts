export class GeometryEdgeVisualizer extends Mesh<BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material | import("three").Material[], import("three").Object3DEventMap> {
    /**
     * @param {BufferGeometry} geometry
     * @param {string | number} [line_color]
     */
    constructor(geometry: BufferGeometry, line_color?: string | number);
    material: ShaderMaterial;
    hide_faces(): void;
}
import { BufferGeometry } from "three/src/core/BufferGeometry";
import { Mesh } from "three/src/objects/Mesh";
import { ShaderMaterial } from "three/src/materials/ShaderMaterial";
