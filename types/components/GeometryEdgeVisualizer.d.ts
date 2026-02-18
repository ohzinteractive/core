import { BufferGeometry, Mesh, ShaderMaterial } from "three";

export class GeometryEdgeVisualizer extends Mesh {
    constructor(geometry: BufferGeometry, line_color?: string | number);
    material: ShaderMaterial;
    
    hide_faces(): void;
}

