export class UpdatableMaterialMesh extends Mesh<BufferGeometry<import("three").NormalBufferAttributes>, Material | Material[], import("three").Object3DEventMap> {
    /**
     * @param {BufferGeometry} geometry
     * @param {Material} material
     */
    constructor(geometry: BufferGeometry, material: Material);
    material: Material;
    onBeforeRender: () => void;
}
import { BufferGeometry } from "three/src/core/BufferGeometry";
import { Material } from "three/src/materials/Material";
import { Mesh } from "three/src/objects/Mesh";
