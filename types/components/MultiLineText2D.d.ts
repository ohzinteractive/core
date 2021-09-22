export class MultiLineText2D {
    constructor(text_array: any, font: any, color: any, pivot: any, is_static: any);
    text_array: Text2D[];
    update_text_positions(): void;
    set texts(arg: any[]);
    get texts(): any[];
    set size(arg: number);
    get size(): number;
}
import { Text2D } from "./Text2D";
