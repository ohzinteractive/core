export declare class Compilator {
    finished: boolean;
    start(): void;
    update(): void;
}
export type CompilatorConstructor = new (...args: any[]) => Compilator;
