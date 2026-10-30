export declare class ViewComponent {
    container: HTMLElement;
    hidden: boolean;
    name: string;
    constructor({ name, container }: {
        name: string;
        container: HTMLElement;
    });
    start(): void;
    on_enter(): void;
    update(current_state_data: any): void;
    on_exit(): void;
    set_opacity(current_state_data: any): void;
    toggle_hidden(): void;
}
