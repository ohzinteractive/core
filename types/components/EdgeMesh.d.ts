export default class EdgeMesh {
    constructor(buffer_geometry: any, thickness: any, color: any);
    edges_material: any;
    corners_material: any;
    edges_mesh: any;
    corners_mesh: any;
    __get_edges(cube_geometry: any): any[];
    update(TIME: any): void;
    __get_edges_geometry(points: any): any;
    __get_corners_geometry(geometry_vertices: any): any;
    set_visible(boolean: any): void;
    dispose(): void;
}
