declare class EasingFunctions {
    constructor();
    static linear(x: number): number;
    static triangular(x: number): number;
    static ease_in_sine(x: number): number;
    static ease_out_sine(x: number): number;
    static ease_in_out_sine(x: number): number;
    static ease_in_cubic(x: number): number;
    static ease_out_cubic(x: number): number;
    static ease_in_out_cubic(x: number): number;
    static ease_in_quad(x: number): number;
    static ease_out_quad(x: number): number;
    static ease_in_out_quad(x: number): number;
    static ease_in_quart(x: number): number;
    static ease_out_quart(x: number): number;
    static ease_in_out_quart(x: number): number;
    static ease_in_quint(x: number): number;
    static ease_out_quint(x: number): number;
    static ease_in_out_quint(x: number): number;
    static ease_in_expo(x: number): number;
    static ease_out_expo(x: number): number;
    static ease_in_out_expo(x: number): number;
    static ease_in_circ(x: number): number;
    static ease_out_circ(x: number): number;
    static ease_in_out_circ(x: number): number;
    static ease_in_back(x: number): number;
    static ease_out_back(x: number): number;
    static ease_in_out_back(x: number): number;
    static ease_in_elastic(x: number): number;
    static ease_out_elastic(x: number): number;
    static ease_in_out_elastic(x: number): number;
    static ease_in_bounce(x: number): number;
    static ease_out_bounce(x: number): number;
    static ease_in_out_bounce(x: number): number;
    static heartbeat(t: number): number;
}
/**
 * @typedef {'linear'|'triangular'|'ease_in_sine'|'ease_out_sine'|'ease_in_out_sine'|'ease_in_cubic'|'ease_out_cubic'|'ease_in_out_cubic'|'ease_in_quad'|'ease_out_quad'|'ease_in_out_quad'|'ease_in_quart'|'ease_out_quart'|'ease_in_out_quart'|'ease_in_quint'|'ease_out_quint'|'ease_in_out_quint'|'ease_in_expo'|'ease_out_expo'|'ease_in_out_expo'|'ease_in_circ'|'ease_out_circ'|'ease_in_out_circ'|'ease_in_back'|'ease_out_back'|'ease_in_out_back'|'ease_in_elastic'|'ease_out_elastic'|'ease_in_out_elastic'|'ease_in_bounce'|'ease_out_bounce'|'ease_in_out_bounce'|'heartbeat'} EasingFunctionType
 */
export { EasingFunctions };
