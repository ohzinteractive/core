export class ApplicationViewController extends ViewState {
    constructor({ name, url, transition_data }: {
        name: any;
        url: any;
        transition_data: any;
    });
    url: any;
    current_opacity: number;
    set_opacity(current_state_data: any): void;
}
import { ViewState } from "./ViewState";
