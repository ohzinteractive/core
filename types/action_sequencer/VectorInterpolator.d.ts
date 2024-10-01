export class VectorInterpolator extends ActionInterpolator {
    /**
     * @param {string} attribute_name
     * @param {Vector3} [from]
     * @param {Vector3} [to]
     * @param {import('../utilities/EasingFunctions').EasingFunctionType | function} [easing_function]
     */
    constructor(attribute_name: string, from?: Vector3, to?: Vector3, easing_function?: import('../utilities/EasingFunctions').EasingFunctionType | Function);
    from: Vector3;
    to: Vector3;
}
import { ActionInterpolator } from "./ActionInterpolator";
import { Vector3 } from "three/src/math/Vector3";
