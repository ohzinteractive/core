import { Vector3 } from 'three';
import { ActionInterpolator } from './ActionInterpolator';
declare class VectorInterpolator extends ActionInterpolator {
    attribute_name: string;
    from: Vector3;
    to: Vector3;
    constructor(attribute_name: string, from?: Vector3, to?: Vector3, easing_function?: string);
    update(context: any, t: number): void;
}
export { VectorInterpolator };
