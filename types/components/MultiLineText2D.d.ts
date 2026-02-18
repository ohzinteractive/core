import { Object3D, Vector2 } from "three";
import { Text2D } from "./Text2D";

export class MultiLineText2D extends Object3D {
    constructor(text_array: string[], font?: string, color?: string | number, pivot?: Vector2, is_static?: boolean);
    text_array: Text2D[];

    set texts(arg: string[]);
    get texts(): string[];
    set size(arg: number);
    get size(): number;
    
    update_text_positions(): void;
}
