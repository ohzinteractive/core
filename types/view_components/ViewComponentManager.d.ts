export { view_component_manager as ViewComponentManager };
declare const view_component_manager: ViewComponentManager;
declare class ViewComponentManager {
    components: any[];
    enabled_components: Set<any>;
    update(): void;
    register_component(component: any): void;
    enable_component(component: any): void;
    disable_component(component: any): void;
    get_component_by_name(component_name: any): void;
    get(component_name: any): any;
    __set_components_opacities(): void;
}
