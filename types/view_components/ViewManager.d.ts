declare var _default: ViewManager;
export default _default;
declare class ViewManager {
    views: any[];
    transition_table: TransitionTable;
    transition_handler: ViewStateTransitionHandler;
    update(): void;
    go_to_view(view_name: any, change_url?: boolean, skip?: boolean): void;
    register_view(view: any): void;
    has_view(view_name: any): boolean;
    add_transitions(transitions: any): void;
    set_transitions(transitions: any): void;
    set_view(view_name: any): void;
    get_current_view(): import("./ViewState").default;
    get_view_by_name(view_name: any): void;
    get(view_name: any): any;
    get_view_by_url(url: any): void;
    get_by_url(url: any): any;
    set_initial_state_data(initial_state_data: any): void;
    __change_browser_url(url: any): void;
}
import TransitionTable from "./transition/TransitionTable";
import ViewStateTransitionHandler from "./transition/ViewStateTransitionHandler";
