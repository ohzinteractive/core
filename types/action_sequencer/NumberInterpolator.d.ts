export class NumberInterpolator extends ActionInterpolator {
    /**
     * @param {string} attribute_name
     * @param {number} [from]
     * @param {number} [to]
     * @param {boolean} [initial]
     * @param {import('../utilities/EasingFunctions').EasingFunctionType | function} [easing_function]
     */
    constructor(attribute_name: string, from?: number, to?: number, initial?: boolean, easing_function?: import('../utilities/EasingFunctions').EasingFunctionType | Function);
    from: number;
    to: number;
    initial: boolean;
    /**
     * @param {number} t
     */
    evaluate(t: number): number;
}
import { ActionInterpolator } from "./ActionInterpolator";
