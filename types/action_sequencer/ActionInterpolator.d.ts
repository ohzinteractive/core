export default class ActionInterpolator {
    constructor(easing_function?: string);
    easing_function: any;
    update(context: any, t: any): void;
}
