declare var _default: MeshSampler;
export default _default;
declare class MeshSampler {
    sample(geometry: any, sample_count: any): {
        points: any[];
        normals: any[];
    };
    sample_data_from_faces(faces: any, vertices: any): {
        points: any[];
        normals: any[];
    };
    select_random_faces(faces: any, amount: any): any[];
    get_uniform_face_distribution(face_areas: any, minimum_area: any, faces: any): any[];
    get_face_area(face: any, vertices: any): number;
    sample_point_in_face(w1: any, w2: any, v1: any, v2: any, v3: any): any;
}
