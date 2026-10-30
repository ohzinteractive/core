import type { ApplicationView } from './ApplicationView';
declare class ViewManager {
    browser_title_suffix: string;
    views: ApplicationView[];
    constructor();
    update(): void;
    go_to_view(view_name: string, change_url?: boolean, skip?: boolean): void;
    go_to_scene(scene_name: string, change_url?: boolean, skip?: boolean): void;
    register_view(view: ApplicationView): void;
    has_view(view_name: string): boolean;
    set_view(view_name: string): void;
    set_browser_title_suffix(title_suffix: string): void;
    get_current_view(): import("./ViewState").ViewState;
    get_view_by_name(view_name: string): void;
    get(view_name: string): ApplicationView | undefined;
    get_by_url(url: string): ApplicationView;
    __change_browser_url(url: string): void;
    __change_browser_title(name: string): void;
    __set_views_opacities(): void;
    __capitalize(string: string): string;
    __snake_to_whitespace(string: string): string;
}
declare const view_manager: ViewManager;
export { view_manager as ViewManager };
