import type { EasingFunctionType } from "../utilities/EasingFunctions";
import { ActionInterpolator } from "./ActionInterpolator";
export class NumberInterpolator extends ActionInterpolator {
    constructor(attribute_name: string, from?: number, to?: number, initial?: boolean, easing_function?: EasingFunctionType | Function);
    from: number;
    to: number;
    initial: boolean;

    evaluate(t: number): number;
}
