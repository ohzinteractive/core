export class ActionInterpolator {
    /**
     * @param {import('../utilities/EasingFunctions').EasingFunctionType | function} easing_function
     */
    constructor(easing_function?: import('../utilities/EasingFunctions').EasingFunctionType | Function);
    easing_function: Function;
    attribute_name: string;
    /** @type {number | Vector3} */
    from: number | Vector3;
    /** @type {number | Vector3} */
    to: number | Vector3;
    /**
     * @param {any} context
     * @param {number} t
     */
    update(context: any, t: number): void;
}
import { Vector3 } from "three/src/math/Vector3";
