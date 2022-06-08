export class ApplicationView extends ViewState {
    constructor({ name, url, container }: {
        name: any;
        url: any;
        container: any;
    });
    container: any;
    url: any;
    start(): void;
    show(): void;
    before_enter(): void;
    on_enter(): void;
    before_exit(): void;
    on_exit(): void;
    update(): void;
    set_opacity(opacity: any): void;
    load_html_images(): void;
    load_html_videos(): void;
}
import ViewState from "./ViewState";
