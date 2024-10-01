export class MeshBatcher {
    batch(meshes: any, material: any): BatchedMesh;
    create_batched_mesh(id_table: any, buffer_geometry: any, material: any, max_texture_width: any): BatchedMesh;
}
import { BatchedMesh } from "./BatchedMesh";
