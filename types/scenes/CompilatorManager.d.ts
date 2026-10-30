import type { Compilator } from "../index";
declare class CompilatorManager {
    compilators: Array<Compilator>;
    first_update: boolean;
    index: number;
    constructor(compilators: Array<Compilator>);
    update(): void;
    is_finished(): boolean;
}
export { CompilatorManager };
