import type { BufferGeometry, Material } from 'three';
import { Mesh } from 'three';
declare class UpdatableMaterialMesh extends Mesh {
    constructor(geometry: BufferGeometry, material: Material);
}
export { UpdatableMaterialMesh };
