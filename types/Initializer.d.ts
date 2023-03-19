export { initializer as Initializer };
declare const initializer: Initializer;
declare class Initializer {
    init(canvas: any, app_container: any, context_attributes: any, keyboard_input_container?: Document): void;
    dispose(render_loop: any): void;
}
