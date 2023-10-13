export { view_controller_manager as ViewControllerManager };
declare const view_controller_manager: ViewControllerManager;
declare class ViewControllerManager {
    view_controllers: any[];
    go_to_view_controller(view_controller_name: any, skip?: boolean): void;
    update(): void;
    register_view_controller(view_controller: any): void;
    set_view_controller(view_controller_name: any): void;
    get_current_view_controller(): import("./ViewState").ViewState;
    get(view_controller_name: any): any;
    get_by_url(url: any): any;
    __set_view_controllers_opacities(): void;
    __capitalize(string: any): any;
    __snake_to_whitespace(string: any): any;
}
