import type { ViewComponent } from '../view_components/ViewComponent';
declare class ViewComponentManager {
    components: ViewComponent[];
    enabled_components: Set<ViewComponent>;
    constructor();
    update(): void;
    register_component(component: ViewComponent): void;
    enable_component(component: ViewComponent): void;
    disable_component(component: ViewComponent): void;
    get_component_by_name(component_name: any): void;
    get(component_name: any): ViewComponent;
    __set_components_opacities(): void;
}
declare const view_component_manager: ViewComponentManager;
export { view_component_manager as ViewComponentManager };
