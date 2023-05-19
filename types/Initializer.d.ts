export { initializer as Initializer };
declare const initializer: Initializer;
declare class Initializer {
    init(input: any): void;
    dispose(render_loop: any): void;
}
