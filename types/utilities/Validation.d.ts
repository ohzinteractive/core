declare class Validation {
    constructor();
    static is_int(n: number): boolean;
    static is_float(n: number): boolean;
    static is_number(n: number): boolean;
    static is_json(str: string): boolean;
}
export { Validation };
