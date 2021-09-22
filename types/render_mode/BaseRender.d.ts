export class BaseRender {
    render(): void;
    on_enter(context: any, renderer: any): void;
    on_exit(context: any, renderer: any): void;
    resize(): void;
    dispose(): void;
}
