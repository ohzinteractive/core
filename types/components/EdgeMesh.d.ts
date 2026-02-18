import type { BufferGeometry, BufferGeometryEventMap, InterleavedBufferAttribute, NormalBufferAttributes } from 'three';
import { BufferAttribute, Mesh, Object3D, ShaderMaterial, Vector3 } from 'three';
declare class EdgeMesh extends Object3D {
    corners_material: ShaderMaterial;
    corners_mesh: Mesh;
    edges_material: ShaderMaterial;
    edges_mesh: Mesh;
    constructor(buffer_geometry: BufferGeometry, thickness: number, color: string);
    __get_edges(cube_geometry: BufferGeometry): Vector3[];
    update(time: number): void;
    __get_edges_geometry(points: Vector3[]): BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>;
    __get_corners_geometry(geometry_vertices: BufferAttribute | InterleavedBufferAttribute): BufferGeometry;
    set_visible(boolean: boolean): void;
    dispose(): void;
}
export { EdgeMesh };
