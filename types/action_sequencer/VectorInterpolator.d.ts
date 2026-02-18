import type { Vector3 } from "three";
import type { EasingFunctionType } from "../utilities/EasingFunctions";
import { ActionInterpolator } from "./ActionInterpolator";

export class VectorInterpolator extends ActionInterpolator {
    constructor(attribute_name: string, from?: Vector3, to?: Vector3, easing_function?: EasingFunctionType | Function);
    from: Vector3;
    to: Vector3;
}
