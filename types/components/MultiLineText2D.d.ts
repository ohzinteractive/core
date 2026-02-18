import { Text2D } from './Text2D';
import { Object3D, Vector2 } from 'three';
declare class MultiLineText2D extends Object3D {
    text_array: Text2D[];
    constructor(text_array: string[], font?: string, color?: string | number, pivot?: Vector2, is_static?: boolean);
    update_text_positions(): void;
    set texts(text_array: string[]);
    set size(value: number);
    get texts(): string[];
    get size(): number;
}
export { MultiLineText2D };
