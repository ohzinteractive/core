export class NumberInterpolator extends ActionInterpolator {
    constructor(attribute_name: any, from?: number, to?: number, easing_function?: string);
    attribute_name: any;
    from: number;
    to: number;
    evaluate(t: any): any;
}
import { ActionInterpolator } from "./ActionInterpolator";
