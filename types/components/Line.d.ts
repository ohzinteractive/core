import type { Color, Vector3 } from "three";
import type { NodeMaterial } from "three/webgpu";
import { Mesh } from "three";
export class Line extends Mesh {
    constructor(points?: Vector3[]);
    material: NodeMaterial;
    _length: number;
    accumulated_length: number;
    set thickness(arg: any);
    get thickness(): any;
    set color(arg: any);
    get color(): any;
    
    setup(points: Vector3[]): void;
    __get_previous_position(points: Vector3[], i: number): Vector3;
    __get_next_position(points: Vector3[], i: number): Vector3;
    update(): void;
    distance(): number;
    total_length(): number;
    dispose(): void;
    copy_color(col: Color): void;
}
