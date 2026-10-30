import type { InspectableObject } from './SceneInspector';
export interface NodeSelector {
    uuid?: unknown;
    name?: unknown;
}
export interface NodeChanges {
    position?: unknown;
    rotation?: unknown;
    scale?: unknown;
    visible?: unknown;
}
export interface NodeDetail {
    uuid: string;
    name: string;
    type: string;
    parent: string | null;
    children: number;
    visible: boolean;
    position: number[];
    rotation: number[];
    scale: number[];
    material?: string;
    vertices?: number;
    changed?: string[];
}
declare class SceneEditor {
    get(root: InspectableObject, selector: NodeSelector): NodeDetail;
    set(root: InspectableObject, selector: NodeSelector, changes: NodeChanges): NodeDetail;
    private require;
    private find;
    private apply_vector;
    private describe;
    private parent_label;
    private material_type;
    private vertices;
    private vector;
    private round;
    private error;
}
export { SceneEditor };
