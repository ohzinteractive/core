export { view_manager as ViewManager };
declare const view_manager: ViewManager;
declare class ViewManager {
    views: ViewState[];
    transition_table: TransitionTable;
    transition_handler: ViewStateTransitionHandler;
    view_change_subscribers: any[];
    browser_title_suffix: string;
    update(): void;
    go_to_view(view_name: any, change_url?: boolean, skip?: boolean): void;
    go_to_scene(scene_name: any, change_url?: boolean, skip?: boolean): void;
    subscribe_to_view_change(subscriber: any): void;
    notify_view_change(view_name: any): void;
    register_view(view: any): void;
    has_view(view_name: any): boolean;
    add_transitions(transitions: any): void;
    set_transitions(transitions: any): void;
    set_view(view_name: any): void;
    set_browser_title_suffix(title_suffix: any): void;
    get_current_view(): import("./ViewState").ViewState;
    get_view_by_name(view_name: any): void;
    get(view_name: any): any;
    get_view_by_url(url: any): void;
    get_by_url(url: any): any;
    set_default_state_data(default_state_data: any): void;
    __change_browser_url(url: any): void;
    __change_browser_title(name: any): void;
    __set_views_opacities(): void;
    __capitalize(string: any): any;
    __snake_to_whitespace(string: any): any;
}
import { TransitionTable } from "./transition/TransitionTable";
import { ViewStateTransitionHandler } from "./transition/ViewStateTransitionHandler";
import { ViewState } from "./ViewState";

