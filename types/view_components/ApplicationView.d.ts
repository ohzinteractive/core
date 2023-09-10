export class ApplicationView extends ViewState {
    constructor({ name, url, container }: {
        name: any;
        url: any;
        container: any;
    });
    container: any;
    url: any;
    load_html_images(): void;
    load_html_videos(): void;
    set_opacity(current_state_data: any): void;
}
import { ViewState } from "./ViewState";
