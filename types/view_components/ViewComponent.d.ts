export class ViewComponent {
    constructor({ name, container }: {
        name: any;
        container: any;
    });
    name: any;
    container: any;
    hidden: boolean;
    start(): void;
    on_enter(): void;
    update(): void;
    on_exit(): void;
    set_opacity(opacity: any): void;
    toggle_hidden(): void;
}
