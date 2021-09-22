 export class MeshSampler {
    static sample(geometry: any, sample_count: any): {
        points: any[];
        normals: any[];
    };
    static sample_data_from_faces(faces: any, vertices: any): {
        points: any[];
        normals: any[];
    };
    static select_random_faces(faces: any, amount: any): any[];
    static get_uniform_face_distribution(face_areas: any, minimum_area: any, faces: any): any[];
    static get_face_area(face: any, vertices: any): number;
    static sample_point_in_face(w1: any, w2: any, v1: any, v2: any, v3: any): any;
}
