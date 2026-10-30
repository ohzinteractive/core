import { LineMaterial } from '../materials/LineMaterial';
import type { Color, ColorRepresentation, Vector3 } from 'three';
import { Mesh } from 'three';
declare class Line extends Mesh {
    _length: number;
    accumulated_length: number;
    material: LineMaterial;
    constructor(points?: Vector3[]);
    setup(points: Vector3[]): void;
    set thickness(value: number);
    get thickness(): number;
    __get_previous_position(points: Vector3[], i: number): Vector3;
    __get_next_position(points: Vector3[], i: number): Vector3;
    update(): void;
    distance(): number;
    total_length(): number;
    dispose(): void;
    set color(col: ColorRepresentation);
    get color(): Color;
    copy_color(col: Color): void;
}
export { Line };
