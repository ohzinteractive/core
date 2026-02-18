import { BufferAttribute, BufferGeometry, InterleavedBufferAttribute, Mesh, Object3D, ShaderMaterial, Vector3 } from "three";

export class EdgeMesh extends Object3D {
    constructor(buffer_geometry: BufferGeometry, thickness?: number, color?: string);
    edges_material: ShaderMaterial;
    corners_material: ShaderMaterial;
    edges_mesh: Mesh;
    corners_mesh: Mesh;

    __get_edges(cube_geometry: BufferGeometry): Vector3[];
    update(TIME: number): void;
    __get_edges_geometry(points: Vector3[]): BufferGeometry;
    __get_corners_geometry(geometry_vertices: BufferAttribute | InterleavedBufferAttribute): BufferGeometry;
    set_visible(boolean: boolean): void;
    dispose(): void;
}
