export { view_manager as ViewManager };
declare const view_manager: ViewManager;
declare class ViewManager {
    views: ViewState[];
    browser_title_suffix: string;
    update(): void;
    go_to_view(view_name: any, change_url?: boolean, skip?: boolean): void;
    go_to_scene(scene_name: any, change_url?: boolean, skip?: boolean): void;
    register_view(view: any): void;
    has_view(view_name: any): boolean;
    set_view(view_name: any): void;
    set_browser_title_suffix(title_suffix: any): void;
    get_current_view(): import("./ViewState").ViewState;
    get_view_by_name(view_name: any): void;
    get(view_name: any): any;
    get_by_url(url: any): any;
    __change_browser_url(url: any): void;
    __change_browser_title(name: any): void;
    __set_views_opacities(): void;
    __capitalize(string: any): any;
    __snake_to_whitespace(string: any): any;
}
import { ViewState } from "./ViewState";
