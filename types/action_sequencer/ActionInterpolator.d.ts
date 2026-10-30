import type { Vector3 } from 'three';
declare class ActionInterpolator {
    attribute_name: string;
    easing_function: Function;
    from: number | Vector3;
    to: number | Vector3;
    constructor(easing_function?: string);
    update(context: any, t: number): void;
}
export { ActionInterpolator };
