export interface InspectableVector {
    x: number;
    y: number;
    z: number;
}
export interface InspectableObject {
    uuid?: string;
    name?: string;
    type?: string;
    visible?: boolean;
    position?: InspectableVector;
    rotation?: InspectableVector;
    scale?: InspectableVector;
    children?: InspectableObject[];
    material?: unknown;
    geometry?: unknown;
}
export interface SceneNode {
    uuid: string;
    name: string;
    type: string;
    position: number[];
    rotation?: number[];
    scale?: number[];
    visible?: boolean;
    material?: string;
    vertices?: number;
    children?: SceneNode[];
    truncated?: string;
}
export interface InspectOptions {
    depth?: unknown;
    max_nodes?: unknown;
    filter?: unknown;
}
export interface SceneInspectionResult {
    root: SceneNode | null;
    counts: {
        total: number;
        meshes: number;
        returned: number;
    };
    truncated: boolean;
    notes: string[];
}
declare class SceneInspector {
    inspect(root: InspectableObject, options: InspectOptions): SceneInspectionResult;
    private serialise;
    private count;
    private mark;
    private describe_material;
    private material_type;
    private count_vertices;
    private vector;
    private round;
    private is_uniform;
    private positive;
}
export { SceneInspector };
