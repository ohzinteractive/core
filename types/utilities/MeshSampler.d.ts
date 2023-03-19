export { mesh_sampler as MeshSampler };
declare const mesh_sampler: MeshSampler;
declare class MeshSampler {
    sample(buffer_geometry: any, sample_count: any): {
        points: any[];
        normals: any[];
        tangents: any[];
        uvs: any[];
    };
    sample_data_from_faces(faces: any): {
        points: any[];
        normals: any[];
        tangents: any[];
        uvs: any[];
    };
    select_random_faces(faces: any, amount: any): any[];
    get_uniform_face_distribution(face_areas: any, minimum_area: any, faces: any): any[];
    get_face_area(face: any): number;
    sample_point_in_face(w1: any, w2: any, v1: any, v2: any, v3: any): any;
}
