export class NumberInterpolator extends ActionInterpolator {
    constructor(attribute_name: any, from?: number, to?: number, initial?: boolean, easing_function?: string);
    attribute_name: any;
    from: number;
    to: number;
    initial: boolean;
    evaluate(t: any): number;
}
import { ActionInterpolator } from "./ActionInterpolator";
