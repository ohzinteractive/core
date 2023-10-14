export { view_component_contorller_manager as ViewComponentControllerManager };
declare const view_component_contorller_manager: ViewComponentControllerManager;
declare class ViewComponentControllerManager {
    component_controllers: any[];
    enabled_component_controllers: Set<any>;
    update(): void;
    register_component_controller(component_controller: any): void;
    enable_component_controller(component_controller: any): void;
    disable_component_controller(component_controller: any): void;
    get(component_name: any): any;
    __set_component_controllers_opacities(): void;
}
