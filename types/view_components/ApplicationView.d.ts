import { ViewState } from "./ViewState";
export class ApplicationView extends ViewState {
    constructor({ name, url, container, transition_data }: {
        name: any;
        url: any;
        container: any;
        transition_data: any;
    });
    container: any;
    url: any;
    current_opacity: number;
    set_opacity(current_state_data: any): void;
}
