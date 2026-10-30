import type { Renderer } from "three/webgpu";
declare class BaseRender {
    constructor();
    render(renderer?: Renderer): void;
    on_enter(context: any, renderer: Renderer): void;
    on_exit(context: any, renderer: Renderer): void;
    resize(): void;
    dispose(): void;
}
export { BaseRender };
