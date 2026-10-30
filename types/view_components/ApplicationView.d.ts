import { ViewState } from './ViewState';
declare class ApplicationView extends ViewState {
    container: HTMLElement;
    current_opacity: number;
    name: string;
    url: string;
    constructor({ name, url, container, transition_data }: {
        name: string;
        url: string;
        container: HTMLElement;
        transition_data?: any;
    });
    before_enter(): void;
    on_enter(): void;
    before_exit(): void;
    on_exit(): void;
    set_opacity(current_state_data: any): void;
}
export { ApplicationView };
