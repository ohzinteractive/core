import type { Vector3 } from "three";
import type { EasingFunctionType } from "../utilities/EasingFunctions";

export class ActionInterpolator {
    constructor(easing_function?: EasingFunctionType);
    easing_function: Function;
    attribute_name: string;
    from: number | Vector3;
    to: number | Vector3;

    update(context: any, t: number): void;
}
