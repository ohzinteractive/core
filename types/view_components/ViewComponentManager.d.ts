declare var _default: ViewComponentManager;
export default _default;
declare class ViewComponentManager {
    components: any[];
    enabled_components: Set<any>;
    update(): void;
    register_component(component: any): void;
    enable_component(component: any): void;
    disable_component(component: any): void;
    get_component_by_name(component_name: any): void;
    get(component_name: any): any;
}
