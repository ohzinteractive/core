import type { BufferGeometry } from 'three';
import { Vector2, Vector3 } from 'three';
interface Sampleable<T> {
    add(v: T): T;
    clone(): T;
    multiplyScalar(scalar: number): T;
}
interface Face {
    a: Vector3;
    b: Vector3;
    c: Vector3;
    normal: Vector3 | undefined;
    tangent: Vector3 | undefined;
    uv_a: Vector2 | undefined;
    uv_b: Vector2 | undefined;
    uv_c: Vector2 | undefined;
}
declare class MeshSampler {
    constructor();
    sample(buffer_geometry: BufferGeometry, sample_count: number): {
        points: Vector3[];
        normals: Vector3[];
        tangents: Vector3[];
        uvs: Vector2[];
    };
    sample_data_from_faces(faces: Face[]): {
        points: Vector3[];
        normals: Vector3[];
        tangents: Vector3[];
        uvs: Vector2[];
    };
    select_random_faces(faces: Face[], amount: number): Face[];
    get_uniform_face_distribution(face_areas: number[], minimum_area: number, faces: Face[]): Face[];
    get_face_area(face: Face): number;
    sample_point_in_face<T extends Sampleable<T>>(w1: number, w2: number, v1: T, v2: T, v3: T): T;
}
declare const mesh_sampler: MeshSampler;
export { mesh_sampler as MeshSampler };
