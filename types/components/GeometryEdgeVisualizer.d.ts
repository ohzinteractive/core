import type { BufferGeometry } from 'three';
import { Mesh, ShaderMaterial } from 'three';
declare class GeometryEdgeVisualizer extends Mesh {
    material: ShaderMaterial;
    constructor(geometry: BufferGeometry, line_color?: string | number);
    hide_faces(): void;
}
export { GeometryEdgeVisualizer };
