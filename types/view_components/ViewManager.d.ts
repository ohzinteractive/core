import { TransitionTable } from "ohzi-core";
import { ViewStateTransitionHandler } from "ohzi-core/types/view_components/transition/ViewStateTransitionHandler";
import { ViewState } from "ohzi-core/types/view_components/ViewState";

 export class ViewManager {
    static views: ViewState[];
    static transition_table: TransitionTable;
    static transition_handler: ViewStateTransitionHandler;
    static update(): void;
    static go_to_view(view_name: any, change_url?: boolean, skip?: boolean): void;
    static register_view(view: any): void;
    static has_view(view_name: any): boolean;
    static add_transitions(transitions: any): void;
    static set_transitions(transitions: any): void;
    static set_view(view_name: any): void;
    static get_current_view(): ViewState;
    static get_view_by_name(view_name: any): void;
    static get(view_name: any): any;
    static get_view_by_url(url: any): void;
    static get_by_url(url: any): any;
    static set_initial_state_data(initial_state_data: any): void;
    static __change_browser_url(url: any): void;
}

