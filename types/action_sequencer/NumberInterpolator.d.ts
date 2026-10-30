import { ActionInterpolator } from './ActionInterpolator';
declare class NumberInterpolator extends ActionInterpolator {
    from: number;
    to: number;
    initial: boolean;
    constructor(attribute_name: string, from?: number, to?: number, initial?: boolean, easing_function?: string);
    update(context: any, t: number): void;
    evaluate(t: number): number;
}
export { NumberInterpolator };
