import type { BufferGeometry, Material } from "three";
import { Mesh } from "three";

export class UpdatableMaterialMesh extends Mesh {
    constructor(geometry: BufferGeometry, material: Material);
    material: Material;

    onBeforeRender: () => void;
}
