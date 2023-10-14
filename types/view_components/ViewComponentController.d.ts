export class ViewComponentController {
    constructor({ name }: {
        name: any;
    });
    name: any;
    current_opacity: number;
    hidden: boolean;
    start(): void;
    on_enter(): void;
    update(): void;
    on_exit(): void;
    set_opacity(current_state_data: any): void;
    toggle_hidden(): void;
}
