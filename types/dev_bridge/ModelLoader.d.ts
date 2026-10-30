import type { Object3D } from 'three';
export type GltfLike = {
    scene: Object3D;
};
export type LoadGltf = (url: string, draco: boolean) => Promise<GltfLike>;
export interface ResourceStore {
    replace_resource(name: string, url: string, resource: unknown): void;
}
export interface ModelSummary {
    name: string;
    meshes: number;
    triangles: number;
    bounding_box: {
        min: number[];
        max: number[];
    } | null;
}
/**
 * Loads a GLB into the running scene for the import_model preview. A model of
 * the same name is swapped out, so importing a re-exported file again replaces
 * it in place.
 */
declare class ModelLoader {
    private load_gltf;
    private resources;
    constructor(load_gltf: LoadGltf, resources: ResourceStore);
    load(scene: Object3D, args: Record<string, unknown>): Promise<ModelSummary>;
    private summarize;
    private dispose;
    private load_error;
    private error;
}
export { ModelLoader };
